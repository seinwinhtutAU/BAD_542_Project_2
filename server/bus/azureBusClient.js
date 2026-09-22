const { ServiceBusClient } = require('@azure/service-bus');

/**
 * Azure Service Bus SDK Adapter
 * Handles real Azure Service Bus Topic publishing and Subscription receiving.
 */
class AzureBusClient {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.sbClient = new ServiceBusClient(connectionString);
    this.senders = new Map();
    this.receivers = new Map();
    console.log('[AzureBus] Initialized Azure Service Bus Client');
  }

  async publish(topicName, eventData) {
    if (!this.senders.has(topicName)) {
      this.senders.set(topicName, this.sbClient.createSender(topicName));
    }
    const sender = this.senders.get(topicName);

    const message = {
      body: eventData,
      contentType: 'application/json',
      messageId: eventData.eventId || `asb-${Date.now()}`,
      correlationId: eventData.orderId,
      applicationProperties: {
        eventType: eventData.type,
        sourceService: eventData.sourceService,
        timestamp: new Date().toISOString()
      }
    };

    await sender.sendMessages(message);
    return message;
  }

  subscribe(topicName, subscriptionName, handler) {
    const receiverKey = `${topicName}:${subscriptionName}`;
    if (this.receivers.has(receiverKey)) {
      return;
    }

    const receiver = this.sbClient.createReceiver(topicName, subscriptionName);
    this.receivers.set(receiverKey, receiver);

    receiver.subscribe({
      processMessage: async (serviceBusReceivedMessage) => {
        try {
          const body = serviceBusReceivedMessage.body;
          await handler({
            messageId: serviceBusReceivedMessage.messageId,
            body: typeof body === 'string' ? JSON.parse(body) : body,
            applicationProperties: serviceBusReceivedMessage.applicationProperties
          });
        } catch (err) {
          console.error(`[AzureBus] Error in subscription ${subscriptionName}:`, err);
        }
      },
      processError: async (args) => {
        console.error(`[AzureBus] Error from source ${args.errorSource} in subscription ${subscriptionName}:`, args.error);
      }
    });

    console.log(`[AzureBus] Subscribed receiver '${subscriptionName}' on topic '${topicName}'`);
  }

  async close() {
    for (const sender of this.senders.values()) {
      await sender.close();
    }
    for (const receiver of this.receivers.values()) {
      await receiver.close();
    }
    await this.sbClient.close();
  }
}

module.exports = AzureBusClient;
