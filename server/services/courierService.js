const busManager = require('../bus/busManager');
const { EventTypes, Services } = require('../bus/events');
const config = require('../config/env');

class CourierService {
  constructor() {
    this.dispatches = new Map();
  }

  init() {
    busManager.subscribeService(config.SUBSCRIPTIONS.COURIER, async (event) => {
      await this.handleEvent(event);
    });
    console.log('🛵 [CourierService] Initialized & listening to Azure Service Bus');
  }

  async handleEvent(event) {
    const { orderId } = event;

    if (event.type === EventTypes.COURIER_ASSIGNMENT_FAILED) {
      this.dispatches.set(orderId, {
        orderId,
        status: 'FAILED',
        reason: event.payload.reason || 'No couriers available',
        timestamp: new Date().toLocaleTimeString()
      });
    }

    if (event.type === EventTypes.COURIER_ASSIGNED) {
      this.dispatches.set(orderId, {
        orderId,
        status: 'ASSIGNED',
        driver: event.payload.courier,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }

  getDispatches() {
    return Array.from(this.dispatches.values());
  }
}

const courierServiceInstance = new CourierService();
module.exports = courierServiceInstance;
