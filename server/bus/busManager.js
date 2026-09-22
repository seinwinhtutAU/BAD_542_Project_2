const config = require('../config/env');
const AzureBusClient = require('./azureBusClient');
const LocalBusClient = require('./localBusClient');
const { v4: uuidv4 } = require('uuid');

class BusManager {
  constructor() {
    this.io = null;
    this.logs = [];
    this.isAzure = Boolean(config.AZURE_SERVICE_BUS_CONNECTION_STRING && config.AZURE_SERVICE_BUS_CONNECTION_STRING.trim() !== '');
    
    if (this.isAzure) {
      console.log('⚡ [BusManager] Mode: Azure Service Bus Cloud');
      this.client = new AzureBusClient(config.AZURE_SERVICE_BUS_CONNECTION_STRING);
    } else {
      console.log('🚀 [BusManager] Mode: Local Service Bus Simulator (Zero-Config)');
      this.client = new LocalBusClient();
    }
  }

  setSocketIO(io) {
    this.io = io;
  }

  getMode() {
    return this.isAzure ? 'Azure Service Bus' : 'Local Service Bus Emulator';
  }

  async publishEvent(eventType, sourceService, payload) {
    const event = {
      eventId: uuidv4(),
      type: eventType,
      sourceService,
      orderId: payload.orderId,
      timestamp: new Date().toISOString(),
      payload
    };

    // Store in internal memory log
    const logEntry = {
      id: event.eventId,
      eventType: event.type,
      sourceService: event.sourceService,
      orderId: event.orderId,
      timestamp: event.timestamp,
      payload: event.payload,
      busMode: this.getMode()
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > 200) {
      this.logs.pop();
    }

    console.log(`📡 [BUS PUB] [${sourceService}] -> ${eventType} (Order: ${payload.orderId})`);

    // Broadcast via WebSocket to connected React UI
    if (this.io) {
      this.io.emit('bus:event', logEntry);
    }

    // Publish to underlying message bus
    await this.client.publish(config.SERVICE_BUS_TOPIC, event);
    return event;
  }

  subscribeService(subscriptionName, handler) {
    this.client.subscribe(config.SERVICE_BUS_TOPIC, subscriptionName, async (msg) => {
      const event = msg.body;
      if (event && event.type) {
        await handler(event);
      }
    });
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    if (this.client.clearHistory) {
      this.client.clearHistory();
    }
  }
}

const busManagerInstance = new BusManager();
module.exports = busManagerInstance;
