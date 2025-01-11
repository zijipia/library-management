const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    // Tìm và thay đổi tiêu đề User-Agent
    let dataStr = data.toString();
    dataStr = dataStr.replace(
      /User-Agent: .*/,
      "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    );
    socket.write(dataStr);
  });
});

server.listen(8080, () => {
  console.log("Proxy server listening on port 8080");
});
