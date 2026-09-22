const { v4: uuidv4 } = require('uuid');
const busManager = require('../bus/busManager');
const { EventTypes, Services } = require('../bus/events');
const config = require('../config/env');
const db = require('../db/mysql');

class OrderService {
  constructor() {
    this.orders = new Map();
  }

  init() {
    busManager.subscribeService(config.SUBSCRIPTIONS.ORDER, async (event) => {
      await this.handleEvent(event);
    });
    console.log('📦 [OrderService] Initialized & listening to Azure Service Bus');
  }

  async createOrder({ customerName, customerPhone, deliveryAddress, deliveryNotes, items, totalAmount, paymentMethod }) {
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;
    
    const newOrder = {
      orderId,
      customerName: customerName || 'Alex Taylor',
      customerPhone: customerPhone || '+1 (555) 438-9021',
      deliveryAddress: deliveryAddress || '742 Evergreen Terrace, Apt 4B',
      deliveryNotes: deliveryNotes || '',
      paymentMethod: paymentMethod || 'Credit Card (•••• 4242)',
      items: items || [],
      grandTotal: totalAmount || 41.00,
      status: 'PAID', // Payment is charged on creation
      steps: [
        {
          id: 'payment',
          title: 'Payment Authorization',
          status: 'SUCCESS',
          detail: `Payment of $${(totalAmount || 41.00).toFixed(2)} charged successfully.`,
          timestamp: new Date().toLocaleTimeString()
        },
        {
          id: 'restaurant',
          title: 'Restaurant Approval & Kitchen',
          status: 'AWAITING_ACTION',
          detail: 'Order received. Awaiting restaurant kitchen acceptance...',
          timestamp: null
        },
        {
          id: 'courier',
          title: 'Courier Dispatch',
          status: 'PENDING',
          detail: 'Awaiting food preparation...',
          timestamp: null
        }
      ],
      compensations: null,
      driver: null,
      createdAt: new Date().toLocaleTimeString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.set(orderId, newOrder);

    // Save to MySQL
    await db.saveOrder(newOrder);

    // Publish OrderCreated event to Azure Service Bus
    await busManager.publishEvent(EventTypes.ORDER_CREATED, Services.ORDER, {
      orderId,
      customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      deliveryAddress: newOrder.deliveryAddress,
      items: newOrder.items,
      totalAmount: newOrder.grandTotal,
      paymentMethod: newOrder.paymentMethod
    });

    return newOrder;
  }

  async handleEvent(event) {
    const { orderId } = event;
    const order = this.orders.get(orderId);
    if (!order) return;

    const time = new Date().toLocaleTimeString();

    switch (event.type) {
      case EventTypes.PAYMENT_PROCESSED:
        order.paymentId = event.payload.paymentId;
        break;

      // When Restaurant Clicks "Accept Order & Start Cooking"
      case EventTypes.RESTAURANT_CONFIRMED:
        order.status = 'PREPARING';
        order.restaurantOrderId = event.payload.restaurantOrderId;
        order.steps = order.steps.map(s => {
          if (s.id === 'restaurant') {
            return {
              ...s,
              status: 'SUCCESS',
              detail: `Restaurant accepted order. Cooking food in kitchen...`,
              timestamp: time
            };
          }
          if (s.id === 'courier') {
            return {
              ...s,
              status: 'AWAITING_ACTION',
              detail: 'Food preparing. Ready for courier dispatch action...',
              timestamp: time
            };
          }
          return s;
        });
        break;

      // When Courier Clicks "Assign Driver"
      case EventTypes.COURIER_ASSIGNED:
        order.status = 'OUT_FOR_DELIVERY';
        order.driver = event.payload.courier;
        order.steps = order.steps.map(s => {
          if (s.id === 'courier') {
            return {
              ...s,
              status: 'SUCCESS',
              detail: `Driver ${event.payload.courier.name} assigned. Picked up and on the way.`,
              timestamp: time
            };
          }
          return s;
        });
        break;

      // When Courier Clicks "Courier Failed"
      case EventTypes.COURIER_ASSIGNMENT_FAILED:
        order.status = 'CANCELLED_AND_REFUNDED';
        order.steps = order.steps.map(s => {
          if (s.id === 'courier') {
            return {
              ...s,
              status: 'FAILED',
              detail: 'Courier dispatch failed: No drivers available in delivery zone.',
              timestamp: time
            };
          }
          return s;
        });

        if (!order.compensations) {
          order.compensations = {
            failedReason: event.payload.reason || 'No couriers available in area',
            refund: {
              status: 'REFUNDED',
              amount: order.grandTotal,
              refundId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
              timestamp: time
            },
            restaurant: {
              status: 'CANCELLED',
              note: 'Restaurant kitchen order cancelled.',
              timestamp: time
            },
            notification: {
              status: 'DELIVERED',
              channel: 'SMS',
              message: `Notice: No couriers available. Order #${orderId} cancelled and full refund of $${order.grandTotal.toFixed(2)} issued.`,
              timestamp: time
            }
          };
        }
        break;

      case EventTypes.PAYMENT_REFUNDED:
        if (order.compensations && order.compensations.refund) {
          order.compensations.refund.refundId = event.payload.refundId || order.compensations.refund.refundId;
          order.compensations.refund.timestamp = time;
        }
        break;

      case EventTypes.RESTAURANT_CANCELLED:
        if (order.compensations && order.compensations.restaurant) {
          order.compensations.restaurant.timestamp = time;
        }
        break;

      case EventTypes.CUSTOMER_NOTIFIED:
        if (order.compensations && order.compensations.notification) {
          order.compensations.notification.timestamp = time;
        }
        break;
    }

    order.updatedAt = new Date().toISOString();

    // Save update to MySQL
    await db.saveOrder(order);

    // Real-time WebSocket push to frontend
    if (busManager.io) {
      busManager.io.emit('order:updated', order);
    }
  }

  getAllOrders() {
    return Array.from(this.orders.values()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  getOrder(orderId) {
    return this.orders.get(orderId);
  }
}

const orderServiceInstance = new OrderService();
module.exports = orderServiceInstance;
