let mysql = null;
try {
  mysql = require('mysql2/promise');
} catch (e) {
  // Will be available when running inside Docker container
  mysql = null;
}

const config = require('../config/env');

class Database {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  async init() {
    if (!mysql) {
      console.log('ℹ️ [DB] Note: mysql2 driver not found locally. Running in in-memory mode. (Will connect to MySQL container when launched with Docker)');
      return;
    }

    try {
      // Connect to root to ensure DB exists
      const rootConn = await mysql.createConnection({
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASSWORD
      });

      await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.DB_NAME}\`;`);
      await rootConn.end();

      // Create pool to delivery database
      this.pool = mysql.createPool({
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      await this.createTables();
      this.isConnected = true;
      console.log(`🗄️ [MySQL] Connected to database '${config.DB_NAME}' at ${config.DB_HOST}:${config.DB_PORT}`);
    } catch (err) {
      console.warn(`⚠️ [MySQL] Notice: MySQL not reachable at ${config.DB_HOST}:${config.DB_PORT} (${err.message}). Using fallback memory storage.`);
      this.isConnected = false;
    }
  }

  async createTables() {
    if (!this.pool) return;

    // 1. Orders Table
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(100),
        customer_phone VARCHAR(50),
        delivery_address TEXT,
        delivery_notes TEXT,
        items_json JSON,
        grand_total DECIMAL(10, 2),
        status VARCHAR(50),
        payment_method VARCHAR(100),
        compensations_json JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 2. Payments Table
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50),
        amount DECIMAL(10, 2),
        status VARCHAR(50),
        payment_method VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Refunds Table
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS refunds (
        refund_id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50),
        refund_amount DECIMAL(10, 2),
        reason TEXT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Kitchen Orders Table
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS kitchen_orders (
        ticket_id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50),
        restaurant_name VARCHAR(100),
        status VARCHAR(50),
        prep_time_minutes INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 5. Courier Dispatches Table
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS courier_dispatches (
        dispatch_id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50),
        driver_name VARCHAR(100),
        driver_vehicle VARCHAR(100),
        status VARCHAR(50),
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 6. Notifications Table
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50),
        type VARCHAR(50),
        title VARCHAR(100),
        recipient VARCHAR(100),
        channel VARCHAR(50),
        message TEXT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('🗄️ [MySQL] All 6 relational tables verified/created successfully');
  }

  async saveOrder(order) {
    if (!this.isConnected || !this.pool) return;
    try {
      const sql = `
        INSERT INTO orders (order_id, customer_name, customer_phone, delivery_address, delivery_notes, items_json, grand_total, status, payment_method, compensations_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          status = VALUES(status),
          compensations_json = VALUES(compensations_json);
      `;
      await this.pool.query(sql, [
        order.orderId,
        order.customerName,
        order.customerPhone,
        order.deliveryAddress,
        order.deliveryNotes || '',
        JSON.stringify(order.items || []),
        order.grandTotal,
        order.status,
        order.paymentMethod,
        order.compensations ? JSON.stringify(order.compensations) : null
      ]);
    } catch (err) {
      console.error('[MySQL Error] saveOrder:', err.message);
    }
  }

  async savePayment(payment) {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query(
        `INSERT IGNORE INTO payments (payment_id, order_id, amount, status, payment_method) VALUES (?, ?, ?, ?, ?)`,
        [payment.paymentId, payment.orderId, payment.amount, payment.status, payment.paymentMethod]
      );
    } catch (err) {
      console.error('[MySQL Error] savePayment:', err.message);
    }
  }

  async saveRefund(refund) {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query(
        `INSERT IGNORE INTO refunds (refund_id, order_id, refund_amount, reason, status) VALUES (?, ?, ?, ?, ?)`,
        [refund.refundId, refund.orderId, refund.refundAmount, refund.reason, refund.status]
      );
    } catch (err) {
      console.error('[MySQL Error] saveRefund:', err.message);
    }
  }

  async saveNotification(notif) {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query(
        `INSERT IGNORE INTO notifications (notification_id, order_id, type, title, recipient, channel, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [notif.id, notif.orderId, notif.type, notif.title, notif.recipient, notif.channel, notif.message, 'SENT']
      );
    } catch (err) {
      console.error('[MySQL Error] saveNotification:', err.message);
    }
  }
}

const db = new Database();
module.exports = db;
