const net = require('net');

const client = new net.Socket();
client.connect({ port: 9999, host: process.argv[2] });
client.on('data', (data) => {
  console.log("Received:\n" + data.toString('utf-8'));
});
