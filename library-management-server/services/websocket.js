const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("WebSocket connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("Received WebSocket message:", data);

    // Xử lý dữ liệu từ client
    if (data.action === "scanQR") {
      // Xử lý quét mã QR
      const successs = data.data == "https://ziji.vercel.app/";
      ws.send(
        JSON.stringify({
          action: "authResult",
          success: successs,
          role: "user",
        })
      );
    }
  });

  ws.send(JSON.stringify({ message: "Welcome to WebSocket Server" }));
});

module.exports = wss;
