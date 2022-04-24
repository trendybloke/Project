const mongoose = require('mongoose');

const password = {
    pass: "BigTrendMan2002" 
}

mongoDB = `mongodb+srv://trendman:${password.pass}@cluster0.i6dir.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error: '));
db.once('open', () => {
    console.log("MongoDB Connected.");
})

module.exports = mongoose;