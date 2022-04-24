const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('./config/dbconfig');
const User = require('./models/User');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', [__dirname + '/views']);

// Routes used for testing purposes.
// require('./routes/testroutes')(app);

// Routes used for logging in
require('./routes/loginroutes')(app);

// Routes used for registering users
require('./routes/registerroutes')(app);

// Routes that involve observations
require('./routes/observationroutes')(app);

// Routes that involve users
require('./routes/userroutes')(app);

app.get("/", (req, res) => {
    res.redirect("/login")
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});