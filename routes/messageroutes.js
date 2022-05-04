
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
        if(req.isAuthenticated()){
            if(req.user.accountStatus != "suspended")
                return next();
        }
        res.redirect('/login');
    }

    function sleep(ms){
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        })
    }

    var clientsNeedingHelp = new Array("");

    // Puts this user in the queue for clients needing help
    app.get('/newmessage', checkAuth, (req, res) => {
        if(req.user.kind == "Client"){
            if(!clientsNeedingHelp.find(user => user == req.user.username)){
                clientsNeedingHelp.push(req.user.username);
            }
            res.render("../views/pleasewait.ejs", {
                username: req.user.username,
                place: clientsNeedingHelp.length - 1
            })
        }
        else res.redirect('/login');
    });

    // Removes the user from the queue
    app.post('/cancelsupport', checkAuth, (req, res) => {
        clientsNeedingHelp = clientsNeedingHelp.splice(
            req.body.place,
            1
        );
        res.redirect('/observations');
    })

    // Lets a support user browse clientsNeedingHelp
    app.get('/support', checkAuth, (req, res) => {
        if(req.user.kind == "Support"){
            res.render("../views/support.ejs", {
                current: "requests",
                username: req.user.username,
                kind: "Support",
                requests: clientsNeedingHelp 
            })
        }
    })

    // Retrieves message.ejs
    app.get('/message/:chatid', checkAuth, (req, res) => {
        // Build chat id
        let chatid = new mongoose.Types.ObjectId(req.params.chatid);

        // Find and load the chat room
        Support.findOne(
            { chats: {$elemMatch: {_id: chatid}} },
            { chats: {$elemMatch: {_id: chatid}} },
        (err, qry) => {
            if(err) throw err;

            if(qry == null) {
                res.render('../views/obserror.ejs', {
                    username: req.user.username,
                    current: "",
                    kind: req.user.kind,
                    message: "Chat does not exist."
                });
            }
            else{
                var currentChat = qry.chats.find(chat => chat._id = req.params.chatid)
    
                res.render('../views/message.ejs', {
                    current: "",
                    username: req.user.username,
                    kind: req.user.kind,
                    chat: currentChat,
                    moment: moment
                })
            }

        })  
    })

    // Sends a message to a room
    app.post('/message/:chatid', checkAuth, async (req, res) => {
        await Support.findOneAndUpdate(
            // Filter
            {chats: {$elemMatch: {_id: req.params.chatid}}},
            // Update
            {$push: {'chats.$.messages': { senderUsername: req.user.username, content: req.body.content }}},
            //{ $push: {chats: {messages: { senderUsername: req.user.username, content: req.body.content }}}},
            // Options
            {
                projection: {
                    chats: {$elemMatch: {_id: req.params.chatid}}
                }
            }
        ).then(() => {
            res.redirect(`/message/${req.params.chatid}`);
        });
    })

    // Old message paths
    /*
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
    */
}