const observationroutes = require('./observationroutes');

module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const Observation = require('../models/Observation');
    const path = require('path');
    const passport = require('passport');
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    checkAuth = (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/login');
    }

    app.get('/user/:name', checkAuth, (req, res) => {
        let username = req.params.name;
        // Get user
        User.findOne({username: username}, (err, userQry) => {
            if(err) throw err;
            // Get users posts
            Observation.find({username: username}, (err, postQry) => {
                if(err) throw err;

                // Get user comments
                Observation.find({comments: {username: username}}, (err, commentQry) => {
                    if(err) throw err;
                    res.render('../views/user.ejs', {
                            user: userQry, 
                            posts: postQry, 
                            comments: commentQry, 
                            username:req.user.username,
                            kind: req.user.kind
                    })
                })
            })
        })
    });

}