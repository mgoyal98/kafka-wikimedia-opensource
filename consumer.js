const kafka = require('./kafka');
const config = require('./config');
const { Client: OpenSearchClient } = require('@opensearch-project/opensearch');

const consumer = kafka.consumer({ groupId: config.kafka.consumer.groupId });

const main = async () => {
  const openSourceClient = new OpenSearchClient({
    node: config.openSource.url,
  });

  await consumer.connect();

  try {
    // Create Opensearch Index
    const isIndexExists = await openSourceClient.indices.exists({
      index: config.openSource.indexName,
    });
    if (!isIndexExists) {
      const createIndexResponse = await openSourceClient.indices.create({
        index: config.openSource.indexName,
      });
      console.log('Creating index: ', createIndexResponse.body);
    } else {
      console.log('Index Already Exists');
    }

    // Run Consumer
    await consumer.subscribe({
      topics: [config.kafka.topic],
    });

    // Consume Data and insert data
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const parsedData = JSON.parse(message.value.toString());
          const insertDataResponse = await openSourceClient.index({
            id: parsedData.meta.id,
            index: config.openSource.indexName,
            body: parsedData,
            refresh: true,
          });
          console.log('Inserted Document: ', insertDataResponse.body);
        } catch {}
      },
    });
  } catch (e) {
    console.log('EXCEPTION OCCURED', e);
    consumer.disconnect();
  }
};

main();
