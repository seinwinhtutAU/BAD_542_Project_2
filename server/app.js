const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const config = require('./config/env');
const db = require('./db/mysql');
const busManager = require('./bus/busManager');
const orderService = require('./services/orderService');
const paymentService = require('./services/paymentService');
const restaurantService = require('./services/restaurantService');
const courierService = require('./services/courierService');
const notificationService = require('./services/notificationService');
const { EventTypes, Services } = require('./bus/events');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

busManager.setSocketIO(io);

app.use(cors());
app.use(express.json());

// Initialize MySQL Database & Microservices
async function startServer() {
  await db.init();

  orderService.init();
  paymentService.init();
  restaurantService.init();
  courierService.init();
  notificationService.init();

  // 1. CUSTOMER ACTION: Create & Pay Order
  app.post('/api/orders', async (req, res) => {
    try {
      const { customerName, customerPhone, deliveryAddress, deliveryNotes, items, totalAmount, paymentMethod } = req.body;
      
      const order = await orderService.createOrder({
        customerName,
        customerPhone,
        deliveryAddress,
        deliveryNotes,
        items,
        totalAmount,
        paymentMethod
      });

      res.status(201).json({
        success: true,
        message: 'Order created and payment authorized',
        order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2. RESTAURANT ACTION: Accept & Confirm Food Preparation
  app.post('/api/restaurant/confirm', async (req, res) => {
    try {
      const { orderId } = req.body;
      const order = orderService.getOrder(orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      await busManager.publishEvent(EventTypes.RESTAURANT_CONFIRMED, Services.RESTAURANT, {
        orderId,
        restaurantOrderId: `TICKET-#${Math.floor(10 + Math.random() * 90)}`,
        restaurantName: 'Kyoto Ramen & Izakaya',
        estimatedPrepTimeMinutes: 15,
        status: 'CONFIRMED'
      });

      res.json({ success: true, message: 'Restaurant confirmed food prep' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. COURIER ACTION A: Assign Driver (Happy Path)
  app.post('/api/courier/assign', async (req, res) => {
    try {
      const { orderId } = req.body;
      const order = orderService.getOrder(orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const driver = {
        name: 'Alex Rivera',
        vehicle: 'E-Bike (License: EB-882)',
        rating: 4.9,
        phone: '+1 (555) 987-6543'
      };

      await busManager.publishEvent(EventTypes.COURIER_ASSIGNED, Services.COURIER, {
        orderId,
        dispatchId: `DISP-${Math.floor(100 + Math.random() * 900)}`,
        courier: driver,
        estimatedArrivalMinutes: 18,
        status: 'ASSIGNED'
      });

      res.json({ success: true, message: 'Courier assigned to order', driver });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 3. COURIER ACTION B: Report Courier Failure (Triggers Saga Compensation)
  app.post('/api/courier/fail', async (req, res) => {
    try {
      const { orderId, reason } = req.body;
      const order = orderService.getOrder(orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const failureReason = reason || 'No couriers available in delivery zone (All drivers busy)';

      await busManager.publishEvent(EventTypes.COURIER_ASSIGNMENT_FAILED, Services.COURIER, {
        orderId,
        status: 'FAILED',
        reason: failureReason,
        amount: order.grandTotal,
        customerPhone: order.customerPhone
      });

      res.json({ success: true, message: 'Courier failure triggered. Compensations initiated across all services.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 4. GET ALL ORDERS & STATUS
  app.get('/api/orders', (req, res) => {
    res.json({ orders: orderService.getAllOrders() });
  });

  // 5. GET NOTIFICATIONS
  app.get('/api/notifications', (req, res) => {
    res.json({ notifications: notificationService.getNotifications() });
  });

  // Socket.IO Connection Setup
  io.on('connection', (socket) => {
    socket.emit('initial:data', {
      orders: orderService.getAllOrders(),
      notifications: notificationService.getNotifications()
    });
  });

  // Start Server
  server.listen(config.PORT, '0.0.0.0', () => {
    console.log('====================================================');
    console.log(`🚀 Delivery App Backend API running on port ${config.PORT}`);
    console.log(`📡 Azure Service Bus: ${busManager.getMode()}`);
    console.log(`🗄️ MySQL Database: ${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`);
    console.log('====================================================');
  });
}

startServer().catch(err => {
  console.error('Fatal startup error:', err);
});

module.exports = { app, server };
