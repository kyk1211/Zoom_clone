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

function showRoom(newCount) {
  roomForm.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
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
socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMsg(`${user} arrived`);
});

socket.on("bye", (user, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMsg(`${user} left`);
});

socket.on("new_msg", addMsg);

// it is same with 'socket.on('room_change', (msg) => console.log(msg));'
socket.on('room_change', (rooms) => {
  const roomList = welcome.querySelector('ul');
  roomList.innerHTML = "";
  if(rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.append(li);
  });
});