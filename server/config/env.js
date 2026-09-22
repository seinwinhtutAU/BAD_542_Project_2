require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5001,
  
  // Azure Service Bus Config (Optional - will auto-fallback to local in-memory bus if not set)
  AZURE_SERVICE_BUS_CONNECTION_STRING: process.env.AZURE_SERVICE_BUS_CONNECTION_STRING || '',
  SERVICE_BUS_TOPIC: process.env.SERVICE_BUS_TOPIC || 'delivery-saga-topic',
  SUBSCRIPTIONS: {
    ORDER: 'order-service-sub',
    PAYMENT: 'payment-service-sub',
    RESTAURANT: 'restaurant-service-sub',
    COURIER: 'courier-service-sub',
    NOTIFICATION: 'notification-service-sub'
  },

  // MySQL Database Configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'rootpassword',
  DB_NAME: process.env.DB_NAME || 'delivery_db',

  SIMULATION_STEP_DELAY_MS: parseInt(process.env.SIMULATION_STEP_DELAY_MS || '800', 10)
};
