const mqtt = require("mqtt");

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (err) {
    return false;
  }
}
// Kết nối MQTT Broker
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("MQTT connected");
  client.subscribe("library/devices");
  client.subscribe("test/topic");
});

client.on("message", async (topic, message) => {
  const messageString = message.toString();

  if (!isValidJSON(messageString)) {
    console.warn("Received non-JSON message:", messageString);
    return;
  }

  const data = JSON.parse(messageString);
  // console.log("Parsed JSON data:", data);

  if (topic === "library/devices") {
    if (data.action === "payment") {
      console.log("Pay:", data);
    }
  }

  if (topic === "test/topic") {
    console.log(`nhận được data từ ${data.t}:`, data.d);
  }
});

module.exports = client;
