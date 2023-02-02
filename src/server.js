import express from "express";
import path from "path";

const __dirname = path.resolve();
const app = express();

app.set("view engine", "pug"); // view engine을 pug로 설정
app.set("views", __dirname + "/src/views"); // express에 template 지정
app.use("/public", express.static(__dirname + "/src/public")); // public url 생성해 유저에게 파일 공유

app.get("/", (req, res) => res.render("home"));

app.listen(3000);
