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
socket.emit('joining user', username);

const messages = document.getElementById('messages');
const messageForm = document.getElementById('messageform');
const textInput = document.getElementById('content');

messageTemplate = (sendingUser, content, time) => {
    if(sendingUser == username)
        divclass = "myMessage";
    else divclass = "theirMessage";
    
    return `<div class="${divclass}">
                ${username}
                <div class="${divclass}Content">
                    ${content}
                </div>
                ${time}
            </div>` 
}

messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if(textInput.value) {
        socket.emit('send-message', (message) => {
            console.log(`${username} sends a message...`)
            return {
                username: username,
                content: textInput.value,
                sent: moment(Date.now()).format("hh:mm a DD MMM YYYY")
            }
        })
    }
});

socket.on('new-message', (data) => {
    console.log(`${username} received the message...`)
    messages.innerHTML += messageTemplate(
        data.username,
        data.content,
        data.time
    )
})