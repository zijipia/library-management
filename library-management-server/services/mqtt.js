const mqtt = require("mqtt");

// Kết nối MQTT Broker
const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
  console.log("MQTT connected");
  client.subscribe("library/devices"); // Lắng nghe các thiết bị
});

// Xử lý dữ liệu từ thiết bị
client.on("message", async (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log("Received data from IoT device:", data);

  if (topic === "library/devices") {
    // Ví dụ xử lý dữ liệu từ IoT
    if (data.action === "addBook") {
      // Thêm sách vào database
    }
  }
});

module.exports = client;
