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
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    checkAuth = (req, res, next) => {
        if(req.isAuthenticated()){
            if(req.user.accountStatus != "suspended")
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

    app.get('/edit-user/:name', checkAuth, (req, res) => {
        if(req.user.username != req.params.name && req.user.kind != "Support"){
            res.render('../views/obserror.ejs', {
                username: req.user.username,
                current: "",
                kind: req.user.kind,
                message: "Access denied."
            });
            return;
        }

        // Get the user
        User.findOne({username: req.params.name}, (err, qry) => {
            if(err) throw err;

            // Render edit page
            res.render('../views/edituser', {
                user:{
                    forename: qry.forename,
                    surname: qry.surname,
                    username: qry.username,
                    email: qry.email,
                    phoneNumber: qry.phoneNumber,
                    houseName: qry.address.houseName,
                    street: qry.address.street,
                    town: qry.address.town,
                    postcode: qry.address.postcode,
                    city: qry.address.city,
                    lastFourDigits: qry.paymentDetails.lastFourCardNum,
                    cardName: qry.paymentDetails.cardName,
                }            
            })
        })
    })

    app.post('/edit-user/:name', checkAuth, (req, res) => {
        var thisUser = req.params.name;

        if(req.user.username != thisUser && req.user.kind != "Support"){
            res.render('../views/obserror.ejs', {
                username: req.user.username,
                current: "",
                kind: req.user.kind,
                message: "Access denied."
            });
            return;
        }
        // Get last four digits of cardnum
        let lastFourDigit = req.body.cardnum.substr(req.body.cardnum - 4);

        // Data hashing
        const salt = bcrypt.genSaltSync(saltRounds);

        const newCardNumHash = bcrypt.hashSync(req.body.cardnum, salt);
        const newSecNumHash = bcrypt.hashSync(req.body.ccv, salt);


        User.findOneAndUpdate(
            // Filter
            {username: req.params.name},
            // Update
            {
                forename: req.body.forename,
                surname: req.body.surname,
                username: req.body.username,
                email: req.body.email,
                phoneNumber: req.body.phone,
                notificationPreference: req.body.notif,
                address: {
                    houseName: req.body.houseName,
                    street: req.body.street,
                    town: req.body.town,
                    postcode: req.body.postcode,
                    city: req.body.city,
                    country: req.body.country
                },
                paymentDetails: {
                    cardNumHash: newCardNumHash,
                    cardName: req.body.cardName,
                    expiry: `${req.body.expiremonth}-20${req.body.expireyear}`,
                    creditCardType: req.body.cardtype,
                    secNumHash: newSecNumHash,
                    lastFourCardNum: lastFourDigit
                }                
            }
        ).then(() => {
            res.redirect(`/user/${thisUser}`)
        })
    })

    app.post('/suspend-user/:name', checkAuth, (req, res) => {
        if(req.user.kind == "Support"){
            let suspendingUser = req.params.name;

            User.findOne({username: suspendingUser}, (err, qry) => {
                if(err) throw err;

                qry.accountStatus = "suspended";

                qry.save();

                res.redirect(301, `/user/${suspendingUser}`);
            });
        }
    });

    app.post('/unsuspend-user/:name', checkAuth, (req, res) => {
        if(req.user.kind == "Support"){
            let suspendedUser = req.params.name;

            User.findOne({username: suspendedUser}, (err, qry) => {
                if(err) throw err;

                qry.accountStatus = "active";

                qry.save();

                res.redirect(301, `/user/${suspendedUser}`);
            });
        }
    });
}