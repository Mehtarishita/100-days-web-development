import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 5000 });

const clients = new Set();

wss.on("connection", (ws) => {

  console.log("User connected");
  clients.add(ws);

  broadcast({
    type: "notification",
    message: "🔥 New user joined!"
  });

  ws.on("message", (data) => {

    const msg = JSON.parse(data);

    if(msg.type === "notify") {
      broadcast({
        type: "notification",
        message: msg.message
      });
    }

  });

  ws.on("close", () => {
    clients.delete(ws);
    broadcast({
      type: "notification",
      message: "❌ User left"
    });
  });

});

function broadcast(message) {
  clients.forEach(client => {
    client.send(JSON.stringify(message));
  });
}

console.log("Server running on 5000");