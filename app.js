const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server);
const port = 3000;

const mongoose = require('./config/dbconfig');
const User = require('./models/User');

const session = require('express-session');
const passport = require("passport");

const moment = require('moment');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', [__dirname + '/views']);

// Session management
app.use(
    session({
        secret: "scimblo",
        resave: false,
        saveUninitialized: false
    })
);

// Authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes used for testing purposes.
require('./routes/testroutes')(app);

// Routes used for logging in
require('./routes/loginroutes')(app);

// Routes used for registering users
require('./routes/registerroutes')(app);

// Routes that involve observations
require('./routes/observationroutes')(app);

// Routes that involve users
require('./routes/userroutes')(app);

// Routes that involve messaging
require('./routes/messageroutes')(app);

// Home redirect to login
app.get("/", (req, res) => {
    res.redirect("/login")
});

// Listen for webserver requests
/* app.listen(webPort, () => {
    console.log(`Web listening at http://localhost:${webPort}`);
}); */

// Handles connection events
io.on('connection', (socket) => {
    socket.on('login', ({name, room}, callback) => {
        socket.join(room);
        io.to(room).emit('messages', `${name} has joined room ${room}.`)
    });

    socket.on('send-message', ({message, room}, callback) => {
        io.to(room).emit('new-message', {
            username: message.username,
            content: message.content,
            time: moment(message.time).format('hh:mm a DD MMM YYYY')
        });
    });

    socket.on('disconnect', () => {
    })

});

// Listen for socket message requests
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})