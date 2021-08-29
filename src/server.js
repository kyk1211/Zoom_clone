import http from "http";
import express from "express";
import SocketIo from "socket.io";

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + '/public'));
app.get("/", (_, res) => res.render("home"));
app.get('/*', (_, res) => res.redirect('/'));

const server = http.createServer(app);
const io = SocketIo(server);

function publicRooms() {
  const { 
    sockets: { 
      adapter: { sids, rooms }, 
    }, 
  } = io;
  const publicRooms = [];
  rooms.forEach((value, key) => {
    if(sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on('connection', (socket) => {
  socket['nickname'] = 'Anonymous';

  socket.onAny((e) => {
    console.log(`socket Event: ${e}`)
  });

  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName);
    done(countRoom(roomName));
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    io.sockets.emit("room_change", publicRooms());
  });
  
  socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
  
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => 
    socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1)
    );
  });
  
  socket.on('disconnect', () => {
    io.sockets.emit("room_change", publicRooms());
  })
  
  socket.on('new_msg', (msg, room, done) => {
    socket.to(room).emit('new_msg', `${socket.nickname}: ${msg}`);
    done();
  });
});



/* WebSocket */
// const wss = new WebSocket.Server({ server });
// const sockets = [];
// wss.on('connection', (backSocket) => {
  //   sockets.push(backSocket);
  //   backSocket["nickname"] = "Anonymous";
  //   console.log("Connected to Browser ✅");
  //   backSocket.on("close", onSocketClose);
  //   backSocket.on("message", (msg) => {
    //     const msgObj = JSON.parse(msg);
    //     const msgString = msgObj.payload;
    //     switch(msgObj.type) {
      //       case "new_msg":
      //         sockets.forEach((aSocket) => 
      //           aSocket.send(`${backSocket.nickname}: ${msgString}`)
      //         );
      //         break;
      //       case "nickname":
      //         backSocket["nickname"] = msgString;
      //         break;
      //     }
      //   });
      // });
      
const handleListen = () => console.log(`Listening on http://localhost:3000`);
server.listen(3000, handleListen); 