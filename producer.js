const kafka = require('./kafka');
const config = require('./config');
const EventSource = require('eventsource');
const { CompressionTypes } = require('kafkajs');

const producer = kafka.producer({
  idempotent: true,
});

const main = async () => {
  await producer.connect();

  const events = new EventSource(
    'https://stream.wikimedia.org/v2/stream/recentchange'
  );

  try {
    events.onmessage = async (event) => {
      const message = await producer.send({
        topic: config.kafka.topic,
        messages: [{ value: event.data }],
        compression: CompressionTypes.Snappy,
        acks: -1,
      });
      console.log('\n\n========== Message Produced ===========');
      console.log(message);
      console.log('========== ======== ===========');
    };
  } catch {
    events.close();
    await producer.disconnect();
  }

  events.onerror = async (event) => {
    console.log('\n\n========== ERROR ===========');
    console.log(event);
    console.log('========== ======== ===========');
    await producer.disconnect();
  };
};

main();
