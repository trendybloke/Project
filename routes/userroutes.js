const observationroutes = require('./observationroutes');

module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const Observation = require('../models/Observation');
    const path = require('path');
    const passport = require('passport');
    const moment = require('moment');
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
        let thisUsername = req.params.name;
        // Get user
        User.findOne({username: thisUsername}, (err, userQry) => {
            if(err) throw err;
            // Get users posts
            Observation.find({username: thisUsername}, (err, postQry) => {
                if(err) throw err;

                // Get user comments
                Observation.find(
                    {
                        comments: {$elemMatch: {username: thisUsername}}
                    }, (err, commentQry) => {
                    if(err) throw err;
                    res.render('../views/user.ejs', {
                            user: userQry, 
                            posts: postQry, 
                            comments: commentQry, 
                            username:req.user.username,
                            kind: req.user.kind,
                            moment: moment
                    })
                })
            })
        })
    });

}