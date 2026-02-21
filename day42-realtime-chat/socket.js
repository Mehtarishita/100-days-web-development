export class SocketService {

 constructor(url) {
  this.socket = new WebSocket(url);
 }

 onMessage(callback) {

  this.socket.addEventListener("message", async (e) => {

    let data;

    // handle Blob vs string
    if (e.data instanceof Blob) {
      const text = await e.data.text();
      data = JSON.parse(text);
    } else {
      data = JSON.parse(e.data);
    }

    callback(data);
  });

}
 send(data) {
  try {
    console.log("WebSocket sending data:", data); // Debugging log
    this.socket.send(JSON.stringify(data));
  } catch (error) {
    console.error("Error sending data through WebSocket:", error);
  }
 }

 onOpen(callback) {
  this.socket.addEventListener("open", callback);
 }

}