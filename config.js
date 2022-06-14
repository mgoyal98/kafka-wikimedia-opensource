module.exports = {
  kafka: {
    clientId: 'com-mgoyal-wikimedia-opensource',
    brokers: ['localhost:9092'],
    topic: 'wikimedia.recentchanges',
    consumer: {
      groupId: 'kafka-opensearch-practice',
    },
  },
  openSource: {
    url: 'https://2fy37l5vec:jicd7lycpu@kafka-demo-4226031315.us-east-1.bonsaisearch.net:443',
    indexName: 'wikimedia',
  },
};
