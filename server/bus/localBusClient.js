const EventEmitter = require('events');

/**
 * In-Memory Local Service Bus Simulator
 * Matches Azure Service Bus Topic/Subscription semantics for offline testing & rapid development.
 */
class LocalBusClient extends EventEmitter {
  constructor() {
    super();
    this.subscribers = new Map(); // topicName -> array of { subscriptionName, handler }
    this.messageHistory = [];
  }

  async publish(topicName, eventData) {
    const message = {
      messageId: eventData.eventId || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      body: eventData,
      applicationProperties: {
        eventType: eventData.type,
        service: eventData.sourceService,
        orderId: eventData.orderId,
        timestamp: new Date().toISOString()
      }
    };

    this.messageHistory.push({
      topic: topicName,
      ...message,
      deliveredAt: new Date().toISOString()
    });

    // Notify registered subscribers for this topic asynchronously
    const topicSubs = this.subscribers.get(topicName) || [];
    
    // Process subscribers asynchronously
    setImmediate(() => {
      topicSubs.forEach(async ({ subscriptionName, handler }) => {
        try {
          await handler(message);
        } catch (err) {
          console.error(`[LocalBus] Error handling message in sub '${subscriptionName}':`, err);
        }
      });
    });

    return message;
  }

  subscribe(topicName, subscriptionName, handler) {
    if (!this.subscribers.has(topicName)) {
      this.subscribers.set(topicName, []);
    }
    this.subscribers.get(topicName).push({ subscriptionName, handler });
    console.log(`[LocalBus] Subscribed '${subscriptionName}' to topic '${topicName}'`);
  }

  getHistory() {
    return this.messageHistory;
  }

  clearHistory() {
    this.messageHistory = [];
  }
}

module.exports = LocalBusClient;
