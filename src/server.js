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
  backSocket["nickname"] = "Anonymous";
  console.log("Connected to Browser ✅");
  backSocket.on("close", onSocketClose);
  backSocket.on("message", (msg) => {
    const msgObj = JSON.parse(msg);
    const msgString = msgObj.payload;
    switch(msgObj.type) {
      case "new_msg":
        sockets.forEach((aSocket) => 
          aSocket.send(`${backSocket.nickname}: ${msgString}`)
        );
        break;
      case "nickname":
        backSocket["nickname"] = msgString;
        break;
    }
  });
});

server.listen(3000, handleListen); 