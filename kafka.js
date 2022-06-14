const { Kafka } = require('kafkajs');
const config = require('./config');

const kafkaClient = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
});

module.exports = kafkaClient;
