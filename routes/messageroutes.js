module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const Chat = require('../models/Chat');
    const Message = require('../models/Message');
    const passport = require('passport');
    const path = require('path');
    const moment = require('moment');

    checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }

    function sleep(ms){
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        })
    }

    // Parse the current user, send them to the correct route
    app.get('/newmessage', checkAuth, (req, res) => {

    });

    // Message path
    app.get('/message/:otherName', checkAuth, (req, res) => {
        // Client messaging support
        if(req.user.kind == "Client") {
            // Find the Support that the Client is messaging and load the chats
            Support.findOne(
                // Filter
                {
                    "username": req.params.otherName,
                    "chats.clientUsername": req.user.username
                },
                (err, support) => {
                    if(err) throw err;
                    res.render('../views/message.ejs', {
                        current: "support",
                        username: req.user.username,
                        kind: "Client",
                        chat: support.chats[0],
                        supportUser: req.params.otherName,
                        moment: moment
                    })
                })
        }
        // Support messaging client
        else if(req.user.kind == "Support")
            // Find the Client that the Support is messaging and load the chats
            Support.findOne(
                // Filter
                {
                    "username": req.user.username,
                    "chats.clientUsername": req.params.otherName
                },
                (err, support) => {
                    if(err) throw err;
                    res.render('../views/message.ejs', {
                        current: "chat",
                        username: req.user.username,
                        kind: "Support",
                        chat: support.chats[0],
                        supportUser: req.user.username,
                        moment: moment
                    })
                })
        else
            res.redirect('/login');
    });

    // Send message to chat
    app.post('/message/:supportName', checkAuth, (req, res) => {
        // Expecting {content: String}
        // Get current chat
        // Push new message
        // Save data
        let clientUser;
        let redirectPath;
        if(req.user.kind == "Client") {
            clientUser = req.user.username;
            redirectPath = `/message/${req.params.supportName}`
        }
        else if(req.user.kind == "Support") {
            // FIGURE OUT
            clientUser = "Username"
            redirectPath = `/message/Username`
        }

        Support.findOne({username: req.params.supportName}, (err, sup) => {
            if(err) throw err;

            // FIND OUT HOW TO INDEX TO CORRECT CHAT
            sup.chats[0].messages.push({
                senderUsername: req.user.username,
                content: req.body.content
            })

            sup.save();

            res.redirect(301, redirectPath);
        })

    })
}