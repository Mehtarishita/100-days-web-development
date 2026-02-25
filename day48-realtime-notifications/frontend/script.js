const ws = new WebSocket("ws://localhost:5000");

const container = document.getElementById("notificationContainer");
const btn = document.getElementById("notifyBtn");

ws.onmessage = (event) => {

  const data = JSON.parse(event.data);

  if(data.type === "notification") {
    showNotification(data.message);
  }

};

btn.onclick = () => {

  ws.send(JSON.stringify({
    type:"notify",
    message:"🔥 New custom notification!"
  }));

};

function showNotification(text) {

  const div = document.createElement("div");
  div.className = "notification";
  div.textContent = text;

  container.prepend(div);

}