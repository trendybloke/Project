const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const webPort = 3000;

const io = require('socket.io')(http);
const msgPort = 5000;


const mongoose = require('./config/dbconfig');
const User = require('./models/User');

const session = require('express-session');
const passport = require("passport");

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
app.listen(webPort, () => {
    console.log(`Web listening at http://localhost:${webPort}`);
});

// Handles connection events
io.on('connection', (socket) => {
    // What to do when a client is waiting for support
    socket.on("waiting", ({client}) => {
        // Emit 'new-client' signal
        socket.emit("new-client", ({client}));
    });

    // What to do when a support opens a new room
    socket.on("new-room", ({support, client}) => {
        // Create new chat for the Support and Client if one does not exist

        // Emit clients name as signal - front end redirect to message screen

        // Redirect support to message screen 
    });

    // What to do when someone enters a chat room
    socket.on("login", ({user, room}, callback) => {
        // Determine what the user is
        // If Client...
    });

    // What to do when someone sends a message
    socket.on("send-message", message => {
        console.log("Server received message");
        socket.emit("new-message", (message))
    });

    // What to do when someone disconnects
    socket.on("disconnect", () => {

    });

});

// Listen for socket message requests
http.listen(msgPort, () => {
    console.log(`Messaging listening at http://localhost:${msgPort}`)
})