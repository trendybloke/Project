const observationroutes = require('./observationroutes');

module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const Observation = require('../models/Observation');
    const path = require('path');

    app.get('/user/:name', (req, res) => {
        // Get user
        User.findOne({username: req.params.name}, (err, userQry) => {
            if(err) throw err;

            // Get users posts
            Observation.find({username: req.params.name}, (err, postQry) => {
                if(err) throw err;

                // Get user comments
                Observation.find({comments: {username: req.params.name}}, (err, commentQry) => {
                    if(err) throw err;
                    res.render('../views/user.ejs', 
                        {user: userQry, posts: postQry, comments: commentQry}
                    )
                })
            })
        })
    });
}