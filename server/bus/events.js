/**
 * Event Types across the Distributed Saga
 */
const EventTypes = {
  // Forward flow events
  ORDER_CREATED: 'OrderCreated',
  PAYMENT_PROCESSED: 'PaymentProcessed',
  PAYMENT_FAILED: 'PaymentFailed',
  RESTAURANT_CONFIRMED: 'RestaurantOrderConfirmed',
  RESTAURANT_FAILED: 'RestaurantOrderFailed',
  COURIER_ASSIGNED: 'CourierAssigned',
  ORDER_COMPLETED: 'OrderCompleted',

  // Failure and Compensation events
  COURIER_ASSIGNMENT_FAILED: 'CourierAssignmentFailed',
  PAYMENT_REFUND_REQUESTED: 'PaymentRefundRequested',
  PAYMENT_REFUNDED: 'PaymentRefunded',
  RESTAURANT_CANCEL_REQUESTED: 'RestaurantCancelRequested',
  RESTAURANT_CANCELLED: 'RestaurantOrderCancelled',
  CUSTOMER_NOTIFIED: 'CustomerNotified',
  ORDER_CANCELLED_COMPENSATED: 'OrderCancelledCompensated'
};

/**
 * Service Names
 */
const Services = {
  ORDER: 'OrderService',
  PAYMENT: 'PaymentService',
  RESTAURANT: 'RestaurantService',
  COURIER: 'CourierService',
  NOTIFICATION: 'NotificationService'
};

module.exports = {
  EventTypes,
  Services
};
