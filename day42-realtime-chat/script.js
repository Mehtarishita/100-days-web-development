import { state } from "./state.js";
import { SocketService } from "./socket.js";

const socket = new SocketService("ws://localhost:3000");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typingDiv = document.getElementById("typing");

socket.socket.onopen = () => console.log("CONNECTED TO WS");

// INIT
socket.onOpen(() => {
  console.log("Connected to server");
});

// RECEIVE MESSAGES
socket.onMessage(data => {

  console.log("RECEIVED:", data); // debug

  if (data.type === "message") {

    state.addMessage(data.payload);
    render();

  }

  if (data.type === "typing" && data.user !== state.userId) {

    typingDiv.textContent = "Someone is typing...";

    setTimeout(() => {
      typingDiv.textContent = "";
    }, 1000);

  }

});

// SEND MESSAGE
function sendMessage() {

  const text = input.value.trim();
  if (!text) return;

  const message = {
    type: "message",
    payload: {
      id: Date.now(),
      user: state.userId,
      text
    }
  };

  socket.send(message); // Let socket.js handle JSON.stringify
  input.value = "";
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// TYPING EVENT
input.addEventListener("input", () => {

  socket.send({
    type: "typing",
    user: state.userId
  });

});

// RENDER
function render() {

  messagesDiv.innerHTML = "";

  state.messages.forEach(msg => {

    const div = document.createElement("div");
    div.classList.add("message");

    if (msg.user === state.userId)
      div.classList.add("self");
    else
      div.classList.add("other");

    div.textContent = msg.text;
    messagesDiv.appendChild(div);

  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;

}