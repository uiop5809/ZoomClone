// 프론트에서 socket은 서버 연결을 뜻
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server!");
});

socket.addEventListener("message", (message) =>
  console.log("New message: ", message.data)
);

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

setTimeout(() => {
  socket.send("hello from the browser!");
}, 1000 * 10);
