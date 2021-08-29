const socket = io();

const welcome = document.getElementById('welcome');
const nameForm = document.getElementById('name');
const roomForm = document.getElementById('roomForm');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

function addMsg(msg) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = msg;
  ul.appendChild(li);
}

function handleMsgSubmit(e) {
  e.preventDefault();
  const input = room.querySelector('input');
  const value = input.value;
  socket.emit('new_msg', input.value, roomName, () => {
    addMsg(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  roomForm.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
  const msgForm = document.getElementById('msg');
  msgForm.addEventListener('submit', handleMsgSubmit);
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = roomForm.querySelector('input');
  socket.emit('enter_room', input.value , showRoom);
  roomName = input.value;
  input.value = "";
}

function handleNicknameSubmit(e) {
  e.preventDefault();
  const input = nameForm.querySelector('input');
  socket.emit('nickname', input.value);
}

nameForm.addEventListener('submit', handleNicknameSubmit);
roomForm.addEventListener('submit', handleRoomSubmit);

// response backend
socket.on("welcome", (user) => {
  addMsg(`${user} arrived`);
});

socket.on("bye", (user) => {
  addMsg(`${user} left`);
});

socket.on("new_msg", addMsg);