import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
// import { WebSocketServer } from "ws";

/* SocketIO */
const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug"); // view engine을 pug로 설정
app.set("views", __dirname + "/src/views"); // express에 template 지정
app.use("/public", express.static(__dirname + "/src/public")); // public url 생성해 유저에게 파일 공유

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpserver = http.createServer(app); // http 서버 생성
const wsServer = new Server(httpserver); // http 서버 위에 SocketIO 서버 생성

wsServer.on("connection", (socket) => {
  wsServer.socketsJoin("announcement");
  socket["nickname"] = "익명";
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach(
      (room) => socket.to(room).emit("bye", socket.nickname),
      socket.nickname
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

httpserver.listen(3000, handleListen);

/* WebSocket */

// const wss = new WebSocketServer({ server }); // http 서버 위에 WebSocket 서버 생성

// // 브라우저마다 socket 생성
// const sockets = [];

// // 백에서 socket은 브라우저 연결을 뜻
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "익명";
//   socket.on("close", () => console.log("Disconnected from Browser"));
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload.toString()}`)
//         );
//       case "nickname":
//         socket["nickname"] = message.payload;
//     }
//   });
// });

// {
//   type: "message";
//   payload: "hello everyone!";
// }
// {
//   type: "nickname";
//   payload: "nico";
// }
