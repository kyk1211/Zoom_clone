const msgList = document.querySelector('ul');
const msgForm = document.querySelector('#msg');
const nickForm = document.querySelector("#nick");
const frontSocket = new WebSocket(`ws://${window.location.host}`);

function makeMsg(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleOpen() {
  console.log("Connected to Server ✅");
}

function handleClose() {
  console.log("Disconnected from Server ❌");
}

function handleMsg(msg) {
  const li = document.createElement("li");
  li.innerText = msg.data;
  msgList.append(li);
}

frontSocket.addEventListener("open", handleOpen);
frontSocket.addEventListener("message", handleMsg);
frontSocket.addEventListener("close", handleClose);

function handleSumbit(e) {
  e.preventDefault();
  const input = msgForm.querySelector("input");
  frontSocket.send(makeMsg("new_msg", input.value));
  input.value = "";
}

function handleNickSubmit(e) {
  e.preventDefault();
  const input = nickForm.querySelector("input");
  frontSocket.send(makeMsg("nickname", input.value));
  input.value = "";
}

msgForm.addEventListener('submit', handleSumbit);
nickForm.addEventListener("submit", handleNickSubmit);