import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + '/public'));
app.get("/", (_, res) => res.render("home"));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function onSocketClose() {
  console.log("Disconnected from the Browser ❌");
}

const sockets = [];

wss.on('connection', (backSocket) => {
  sockets.push(backSocket);
  console.log("Connected to Browser ✅");
  backSocket.on("close", onSocketClose);
  backSocket.on("message", (msg, isBinary) => {
    const msgString = isBinary ? msg.data : msg.toString();
    sockets.forEach((aSocket) => aSocket.send(msgString));
  });
});

server.listen(3000, handleListen);