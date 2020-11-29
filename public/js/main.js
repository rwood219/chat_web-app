const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector('#room-name')
const userList = document.querySelector('users')

//get user name and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//join chat room
socket.emit("joinRoom", { username, room });

//get room users
socket.on('roomUsers', ({room, users}) => {
   // outputRoomName(room);
   // outputUsers(users);
})


//message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message text
  const msg = e.target.elements.msg.value;

  //emit to server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output message to dom

outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};


//add room name to dom

outPutRoomName = (room) => {
    roomName.innerText = room
};

//add users to dom
outputUsers = (users) => {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}`).join('')}
    `;
}