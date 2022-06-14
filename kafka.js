const { Kafka } = require('kafkajs');
const config = require('./config');

const kafkaClient = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
  retry: { retries: Number.MAX_SAFE_INTEGER, initialRetryTime: 12000 },
});

module.exports = kafkaClient;
