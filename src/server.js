import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";

const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug"); // view engine을 pug로 설정
app.set("views", __dirname + "/src/views"); // express에 template 지정
app.use("/public", express.static(__dirname + "/src/public")); // public url 생성해 유저에게 파일 공유

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); // http 서버 생성
const wss = new WebSocketServer({ server }); // http 서버 위에 WebSocket 서버 생성

// 백에서 socket은 브라우저 연결을 뜻
wss.on("connection", (socket) => {
  socket.send("hello");
  socket.on("close", () => console.log("Disconnected from Browser"));
  socket.on("message", (message) => {
    console.log(message.toString());
  });
  console.log("Connected to Browser!");
});

server.listen(3000, handleListen);
