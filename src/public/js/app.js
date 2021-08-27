const msgList = document.querySelector('ul');
const msgForm = document.querySelector('form');
const frontSocket = new WebSocket(`ws://${window.location.host}`);

function handleOpen() {
  console.log("Connected to Server ✅");
}

function handleClose() {
  console.log("Disconnected from Server ❌");
}

function handleMsg(msg) {
  console.log("New message: ", msg.data);
}

frontSocket.addEventListener("open", handleOpen);

frontSocket.addEventListener("message", handleMsg);

frontSocket.addEventListener("close", handleClose);

function handleSumbit(e) {
  e.preventDefault();
  const input = msgForm.querySelector("input");
  frontSocket.send(input.value);
  input.value = "";
}

msgForm.addEventListener('submit', handleSumbit);