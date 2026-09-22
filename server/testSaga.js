const orderService = require('./services/orderService');
const paymentService = require('./services/paymentService');
const restaurantService = require('./services/restaurantService');
const courierService = require('./services/courierService');
const notificationService = require('./services/notificationService');
const busManager = require('./bus/busManager');
const { EventTypes, Services } = require('./bus/events');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING AZURE SERVICE BUS SAGA VERIFICATION SUITE');
  console.log('======================================================\n');

  // Initialize microservices
  orderService.init();
  paymentService.init();
  restaurantService.init();
  courierService.init();
  notificationService.init();

  console.log('--- TEST 1: Forward Flow (Happy Path) ---');
  const happyOrder = await orderService.createOrder({
    customerName: 'Alice Green',
    customerPhone: '+1-555-0100',
    totalAmount: 35.50
  });
  console.log(`Created Order ${happyOrder.orderId} [Happy Path]`);
  await sleep(1000);

  // Restaurant confirms
  await busManager.publishEvent(EventTypes.RESTAURANT_CONFIRMED, Services.RESTAURANT, {
    orderId: happyOrder.orderId,
    status: 'CONFIRMED'
  });
  await sleep(1000);

  // Courier assigned
  await busManager.publishEvent(EventTypes.COURIER_ASSIGNED, Services.COURIER, {
    orderId: happyOrder.orderId,
    courier: { name: 'Alex Rivera', vehicle: 'E-Bike' },
    status: 'ASSIGNED'
  });
  await sleep(1000);

  const checkedHappyOrder = orderService.getOrder(happyOrder.orderId);
  console.log(`Order Status: ${checkedHappyOrder.status}`);
  if (checkedHappyOrder.status === 'OUT_FOR_DELIVERY') {
    console.log('✅ TEST 1 PASSED: Order dispatched successfully with courier assigned.');
  } else {
    console.error('❌ TEST 1 FAILED:', checkedHappyOrder.status);
    process.exit(1);
  }

  console.log('\n--- TEST 2: Courier Failure & Saga Compensation Flow ---');
  const failureOrder = await orderService.createOrder({
    customerName: 'Bob Vance',
    customerPhone: '+1-555-0199',
    totalAmount: 52.00
  });
  console.log(`Created Order ${failureOrder.orderId}`);
  await sleep(1000);

  // Restaurant confirms food prep
  await busManager.publishEvent(EventTypes.RESTAURANT_CONFIRMED, Services.RESTAURANT, {
    orderId: failureOrder.orderId,
    status: 'CONFIRMED'
  });
  await sleep(1000);

  // Courier fails to assign -> Triggers Azure Service Bus compensation events
  console.log(`Simulating Courier Failure on Azure Service Bus...`);
  await busManager.publishEvent(EventTypes.COURIER_ASSIGNMENT_FAILED, Services.COURIER, {
    orderId: failureOrder.orderId,
    status: 'FAILED',
    reason: 'NO_COURIERS_AVAILABLE: All drivers busy in delivery zone',
    amount: failureOrder.grandTotal,
    customerPhone: failureOrder.customerPhone
  });

  // Wait for compensations across Payment, Restaurant, and Notification services
  await sleep(2000);

  const checkedFailureOrder = orderService.getOrder(failureOrder.orderId);
  console.log(`Order Status: ${checkedFailureOrder.status}`);
  console.log('Compensations Record:', JSON.stringify(checkedFailureOrder.compensations, null, 2));

  const isRefunded = checkedFailureOrder.compensations?.refund?.status === 'REFUNDED';
  const isCancelled = checkedFailureOrder.compensations?.restaurant?.status === 'CANCELLED';
  const isNotified = checkedFailureOrder.compensations?.notification?.status === 'DELIVERED';
  const isFinalState = checkedFailureOrder.status === 'CANCELLED_AND_REFUNDED';

  if (isRefunded && isCancelled && isNotified && isFinalState) {
    console.log('\n🎉 ✅ TEST 2 PASSED: Courier failure triggered all Azure Service Bus compensation events!');
    console.log('   - 1. Payment Refunded: OK (ID: ' + checkedFailureOrder.compensations.refund.refundId + ')');
    console.log('   - 2. Restaurant Order Cancelled: OK');
    console.log('   - 3. Customer SMS Notification Delivered: OK');
    console.log('   - 4. Final Order Status: CANCELLED_AND_REFUNDED');
  } else {
    console.error('\n❌ TEST 2 FAILED: Not all compensations completed properly.');
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('✨ ALL SAGA VERIFICATION TESTS COMPLETED SUCCESSFULLY');
  console.log('======================================================\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
