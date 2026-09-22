const busManager = require('../bus/busManager');
const { EventTypes, Services } = require('../bus/events');
const config = require('../config/env');
const db = require('../db/mysql');
const { v4: uuidv4 } = require('uuid');

class NotificationService {
  constructor() {
    this.notifications = [];
  }

  init() {
    busManager.subscribeService(config.SUBSCRIPTIONS.NOTIFICATION, async (event) => {
      await this.handleEvent(event);
    });
    console.log('📱 [NotificationService] Initialized & listening to Azure Service Bus');
  }

  async handleEvent(event) {
    const { orderId } = event;

    // 1. COMPENSATION NOTIFICATION (WHEN COURIER FAILS)
    if (event.type === EventTypes.COURIER_ASSIGNMENT_FAILED) {
      const notificationId = `NOTIF-${uuidv4().substring(0, 8).toUpperCase()}`;
      const amount = event.payload.amount ? event.payload.amount.toFixed(2) : '41.00';
      const message = `Aozora Eats Notice: We apologize, no couriers are currently available in your area for order #${orderId}. Your order has been cancelled and a full refund of $${amount} has been issued to your payment method.`;

      const record = {
        id: notificationId,
        orderId,
        type: 'REFUND',
        title: 'Order Cancelled & Refunded',
        recipient: event.payload.customerPhone || '+1 (555) 438-9021',
        channel: 'SMS',
        message,
        time: new Date().toLocaleTimeString(),
        read: false,
        sentAt: new Date().toISOString()
      };

      this.notifications.unshift(record);

      // Persist to MySQL
      await db.saveNotification(record);

      await busManager.publishEvent(EventTypes.CUSTOMER_NOTIFIED, Services.NOTIFICATION, {
        orderId,
        notificationId,
        channel: record.channel,
        message: record.message,
        status: 'SENT'
      });

      if (busManager.io) {
        busManager.io.emit('notification:new', record);
      }
    }

    // 2. DISPATCH NOTIFICATION (WHEN COURIER ASSIGNED)
    if (event.type === EventTypes.COURIER_ASSIGNED) {
      const notificationId = `NOTIF-${uuidv4().substring(0, 8).toUpperCase()}`;
      const message = `Great news! Driver ${event.payload.courier.name} is on the way with your Kyoto Ramen order #${orderId}. Estimated arrival: ~${event.payload.estimatedArrivalMinutes} mins.`;

      const record = {
        id: notificationId,
        orderId,
        type: 'DISPATCH',
        title: 'Courier Dispatched',
        recipient: '+1 (555) 438-9021',
        channel: 'SMS',
        message,
        time: new Date().toLocaleTimeString(),
        read: false,
        sentAt: new Date().toISOString()
      };

      this.notifications.unshift(record);

      // Persist to MySQL
      await db.saveNotification(record);

      await busManager.publishEvent(EventTypes.CUSTOMER_NOTIFIED, Services.NOTIFICATION, {
        orderId,
        notificationId,
        channel: record.channel,
        message: record.message,
        status: 'SENT'
      });

      if (busManager.io) {
        busManager.io.emit('notification:new', record);
      }
    }
  }

  getNotifications() {
    return this.notifications;
  }
}

const notificationServiceInstance = new NotificationService();
module.exports = notificationServiceInstance;
