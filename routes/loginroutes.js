module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const path = require('path');
    const hash = require('object-hash')

    app.get("/login", (req, res) => {
        res.sendFile(path.join(__dirname, '../public/html', 'login.html'));
    });

    app.get("/support", (req, res) => {
        res.sendFile(path.join(__dirname, '../public/html', 'support.html'));
    });

    app.post("/login/parse", (req, res) => {
        // Build parsed user
        User.findOne({username: req.body.username},
            (err, parsedUser) => {
            if (err) throw err; 
    
            // User does not exist
            if (parsedUser === null) {
                res.redirect(404, "/login");
                return;
            }

            // User password is incorrect
            if (parsedUser.passHash !== hash(req.body.password)){
                res.redirect(400, "/login");
                return;
            }

            // Is user a client?
            Client.findOne({username: parsedUser.username}, 
                (err, clientUser) => {
                if(err) throw err;
                
                // User is client, so redirect to browse
                if(clientUser !== null){
                    res.redirect(301, "/observations"); 
                }
                return;
            });

            // Is user a support member?
            Support.findOne({username: parsedUser.username},
             (err, supportUser) => {
                if(err) throw err;

                // User is support member, so redirect to support
                if(supportUser !== null){
                    res.redirect(301, "/support");
                }
                return;
            });
        });
    });
}