var msgDiv = document.getElementById('messageDiv');

msgDiv.scrollTop = msgDiv.scrollHeight;

/* const moment = require("moment");
const io = require('socket.io-client');
const socket = io(); */

// import { moment } from "../../node_modules/moment/src/moment";
// import { io } from "../../node_modules/socket.io/client-dist";
// import * as io from 'socket.io-client';
const socket = io('localhost:3000');

const username = document.getElementById('username').innerHTML;
const room = document.getElementById('room').value;

socket.emit('login', {name: username, room: room});

const messages = document.getElementById('messages');
const messageForm = document.getElementById('messageform');
const textInput = document.getElementById('content');

messageTemplate = (sendingUser, content, time) => {
    if(sendingUser == username)
        divclass = "myMessage";
    else divclass = "theirMessage";
    
    return `<div class="${divclass}">
                ${sendingUser}
                <div class="${divclass}Content">
                    ${content}
                </div>
                ${time}
            </div>` 
}


messageForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let msgContent;

    if(textInput.value) {
        msgContent = textInput.value;
    } else {
        msgContent = "";
    }

    console.log("Sending message...");

    let msg = {
        message: {
            username: username,
            content: msgContent,
            time: Date.now()
        },
        room: room
    }

    socket.emit('send-message', msg)
    
    console.log("Message sent.")
    console.log(`Date: ${msg.time}`)

    e.currentTarget.submit();

});


socket.on('connect', (data) => {
    socket.emit('login', {name: username, room: room})
});

socket.on('messages', (data) => {
    console.log(data);
});

socket.on('new-message', (data) => {
    messages.innerHTML += messageTemplate(
        data.username,
        data.content,
        data.time
    )
    msgDiv.scrollTop = msgDiv.scrollHeight;
})