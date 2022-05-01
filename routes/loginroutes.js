const { fail } = require('assert');

module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const passport = require('passport');
    const path = require('path');
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    checkAuth = (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/login');
    }

    app.get("/login", (req, res) => {
        //res.sendFile(path.join(__dirname, '../public/html', 'login.html'));
        res.render('../views/login.ejs', {message: ""});
    });

    /*app.get("/support", (req, res) => {
        res.sendFile(path.join(__dirname, '../public/html', 'support.html'));
    });*/

    // old login post
    /* app.post("/login/parse", (req, res) => {
        console.log("reached parse...")
        // Build parsed user
        User.findOne({username: req.body.username},
            (err, parsedUser) => {
            if (err) throw err; 
    
            // User does not exist
            if (parsedUser === null) {
                res.redirect(404, "/login");
                return;
            }
            console.log("found user...")
            // User password is incorrect
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                if(err) throw err;

                if (!bcrypt.compare(hash, parsedUser.passHash)){
                    res.redirect(400, "/login");
                    return;
                }
            })
            console.log("password correct...")
            // Is user a client?
            Client.findOne({username: parsedUser.username}, 
                (err, clientUser) => {
                if(err) throw err;
                
                console.log("is user client?...")
                    
                // User is client, so redirect to browse, grant auth. perms
                if(clientUser !== null){
                    res.redirect(301, '/observations')
                }
                return;
            });
            console.log("No, is user suppport?...")
            // Is user a support member?
            Support.findOne({username: parsedUser.username},
             (err, supportUser) => {
                if(err) throw err;
                console.log("Yes, redirect...")
                // User is support member, so redirect to support
                if(supportUser !== null){
                    res.redirect(301, "/support");
                }
                return;
            });
        });
    });
    */

    app.post("/login/parse", 
    passport.authenticate("local", {
        failureRedirect: '/login'
    }),
    (req, res) => {
        let kind;
        // Find user to determine kind
        User.findOne({username: req.body.username},
            (err, user) => {
            if(err) throw err;

            if(user.kind)
                kind = user.kind;
                
            // Is user a client?
            if(kind == "Client"){
                Client.findOne({username: req.body.username}, 
                    (err, clientUser) => {
                    if(err) throw err;
                    
                    // User is client, so redirect to browse
                    if(clientUser !== null){
                        res.redirect(301, '/observations')
                    }
    
                });
            }
            // Is user a support member?
            else if(kind == "Support") {
                Support.findOne({username: req.body.username},
                 (err, supportUser) => {
                    if(err) throw err;
                    
                    // User is support member, so redirect to support
                    if(supportUser !== null){
                        res.redirect(301, `/user/${req.body.username}`);
                    }
                });
            }
        });
    });

    app.get("/logout", (req, res) => {
        req.logout();
        delete req.session;
        delete req.user;
        req.user = null;
        res.redirect(302, '/login');
    });
}