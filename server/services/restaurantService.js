const busManager = require('../bus/busManager');
const { EventTypes, Services } = require('../bus/events');
const config = require('../config/env');

class RestaurantService {
  constructor() {
    this.kitchenOrders = new Map();
  }

  init() {
    busManager.subscribeService(config.SUBSCRIPTIONS.RESTAURANT, async (event) => {
      await this.handleEvent(event);
    });
    console.log('🍳 [RestaurantService] Initialized & listening to Azure Service Bus');
  }

  async handleEvent(event) {
    const { orderId } = event;

    if (event.type === EventTypes.PAYMENT_PROCESSED) {
      this.kitchenOrders.set(orderId, {
        orderId,
        status: 'NEW_ORDER_AWAITING_KITCHEN_ACCEPT',
        timestamp: new Date().toLocaleTimeString()
      });
    }

    if (event.type === EventTypes.RESTAURANT_CONFIRMED) {
      this.kitchenOrders.set(orderId, {
        orderId,
        status: 'PREPARING',
        timestamp: new Date().toLocaleTimeString()
      });
    }

    if (event.type === EventTypes.COURIER_ASSIGNMENT_FAILED) {
      this.kitchenOrders.set(orderId, {
        orderId,
        status: 'CANCELLED_BY_COMPENSATION',
        timestamp: new Date().toLocaleTimeString()
      });

      await busManager.publishEvent(EventTypes.RESTAURANT_CANCELLED, Services.RESTAURANT, {
        orderId,
        status: 'ORDER_CANCELLED',
        action: 'Kitchen ticket voided'
      });
    }
  }

  getKitchenOrders() {
    return Array.from(this.kitchenOrders.values());
  }
}

const restaurantServiceInstance = new RestaurantService();
module.exports = restaurantServiceInstance;
