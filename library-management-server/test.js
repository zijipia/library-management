const mqtt = require("mqtt");
const client = mqtt.connect("mqqt://free2.daki.cc:4171");

client.on("connect", () => {
  console.log("Đã kết nối với MQTT server");
  client.subscribe("test/topic");
});

client.on("message", (topic, message) => {
  console.log(`Nhận message từ topic ${topic}: ${message.toString()}`);
});
let i = 0;
setInterval(() => {
  client.publish(
    "test/topic",
    JSON.stringify({ t: ++i, d: "Hello từ client!" })
  );
}, 5000);
