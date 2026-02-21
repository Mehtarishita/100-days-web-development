const WebSocket = require("ws");

// Create WebSocket Server
const wss = new WebSocket.Server({ port: 3000 });

console.log("WebSocket server running on ws://localhost:3000");

wss.on("connection", (ws) => {

  console.log("Client connected");

  ws.on("message", (message) => {

    const data = JSON.parse(message.toString());

    // Broadcast message to all clients
    wss.clients.forEach((client) => {

      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }

    });

  });

});