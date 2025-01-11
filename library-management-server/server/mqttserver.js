const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const port = 4171;

server.listen(port, function () {
  console.log("server started and listening on port ", port);
});

// Xử lý sự kiện MQTT
aedes.on("client", (client) => {
  console.log(`Client kết nối: ${client.id}`);
});

aedes.on("clientDisconnect", (client) => {
  console.log(`Client ngắt kết nối: ${client.id}`);
});

aedes.on("publish", (packet, client) => {
  // console.log(
  //   `Client ${client ? client.id : "BROKER"} gửi message đến topic ${
  //     packet.topic
  //   }: ${packet.payload}`
  // );
});

module.exports = server;
