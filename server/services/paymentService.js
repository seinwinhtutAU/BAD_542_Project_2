const busManager = require('../bus/busManager');
const { EventTypes, Services } = require('../bus/events');
const config = require('../config/env');
const db = require('../db/mysql');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
  constructor() {
    this.payments = new Map();
    this.refunds = new Map();
  }

  init() {
    busManager.subscribeService(config.SUBSCRIPTIONS.PAYMENT, async (event) => {
      await this.handleEvent(event);
    });
    console.log('💳 [PaymentService] Initialized & listening to Azure Service Bus');
  }

  async handleEvent(event) {
    const { orderId } = event;

    // STEP 1: Process Payment on OrderCreated
    if (event.type === EventTypes.ORDER_CREATED) {
      const paymentId = `PAY-${uuidv4().substring(0, 8).toUpperCase()}`;
      const amount = event.payload.totalAmount;

      const record = {
        paymentId,
        orderId,
        amount,
        status: 'CAPTURED',
        paymentMethod: 'Credit Card (•••• 4242)',
        timestamp: new Date().toLocaleTimeString()
      };

      this.payments.set(orderId, record);

      // Persist payment to MySQL
      await db.savePayment(record);

      await busManager.publishEvent(EventTypes.PAYMENT_PROCESSED, Services.PAYMENT, {
        orderId,
        paymentId,
        amount,
        status: 'SUCCESS'
      });
    }

    // COMPENSATION STEP: Refund on CourierAssignmentFailed
    if (event.type === EventTypes.COURIER_ASSIGNMENT_FAILED) {
      console.log(`⚠️ [PaymentService] Received Compensation Event: ${event.type} for Order ${orderId}`);

      const paymentRecord = this.payments.get(orderId);
      const refundAmount = paymentRecord ? paymentRecord.amount : (event.payload.amount || 41.00);
      const refundId = `REF-${uuidv4().substring(0, 8).toUpperCase()}`;

      const refundRecord = {
        refundId,
        orderId,
        refundAmount,
        reason: event.payload.reason || 'Courier dispatch failure compensation',
        status: 'REFUNDED_TO_CARD',
        timestamp: new Date().toLocaleTimeString()
      };

      this.refunds.set(orderId, refundRecord);
      if (paymentRecord) {
        paymentRecord.status = 'REFUNDED';
      }

      // Persist refund to MySQL
      await db.saveRefund(refundRecord);

      await busManager.publishEvent(EventTypes.PAYMENT_REFUNDED, Services.PAYMENT, {
        orderId,
        paymentId: paymentRecord ? paymentRecord.paymentId : 'PAY-AUTO',
        refundId,
        refundAmount,
        status: 'SUCCESS'
      });
    }
  }

  getPayments() {
    return Array.from(this.payments.values());
  }

  getRefunds() {
    return Array.from(this.refunds.values());
  }
}

const paymentServiceInstance = new PaymentService();
module.exports = paymentServiceInstance;
