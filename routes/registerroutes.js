
module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const passport = require('passport/lib');
    const path = require('path');
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    app.post("/register", (req, res) => {
        res.sendFile(path.join(__dirname, '../public/html', 'register.html'));
    });

    app.post("/register/parse", (req, res) => {
        // Form validation
        /// Matching passwords
        if(req.body.password !== req.body.confirmpassword){
            res.send("Failure!: passwords don't match!")
            return;
        }
        // Get last four digits of cardnum
        let lastFourDigit = req.body.cardnum.substr(req.body.cardnum - 4);

        // Data hashing
        const salt = bcrypt.genSaltSync(saltRounds);

        const newPassHash = bcrypt.hashSync(req.body.password, salt);
        const newCardNumHash = bcrypt.hashSync(req.body.cardnum, salt);
        const newSecNumHash = bcrypt.hashSync(req.body.ccv, salt);

        // Client creation - OLD
        /*
        const newClient = Client({
            username: req.body.username,
            email: req.body.email,
            passHash: newPassHash,
            forename: req.body.forename,
            surname: req.body.surname,
            address: {
                houseName: req.body.houseName,
                street: req.body.street,
                town: req.body.town,
                postcode: req.body.postcode,
                city: req.body.city,
                country: req.body.country
            },
            accountStatus: "active",
            accountType: req.body.category,
            notificationPreference: req.body.notif,
            phoneNumber: req.body.phone,
            paymentDetails: {
                accountBalance: 0,
                cardNumHash: newCardNumHash,
                lastFourCardNum: lastFourDigit,
                cardName: req.body.cardname,
                creditCardType: req.body.cardtype,
                secNumHash: newSecNumHash,
                expiry: `${req.body.expiremonth}-20${req.body.expireyear}`
            }
        });

        // Save new client
        newClient.save((err) => {
            if (err) 
                throw(err);
            res.redirect(301, "/login");
        });
        */
        Client.register({
            username: req.body.username,
            email: req.body.email,
            passHash: newPassHash,
            forename: req.body.forename,
            surname: req.body.surname,
            address: {
                houseName: req.body.houseName,
                street: req.body.street,
                town: req.body.town,
                postcode: req.body.postcode,
                city: req.body.city,
                country: req.body.country
            },
            accountStatus: "active",
            accountType: req.body.category,
            notificationPreference: req.body.notif,
            phoneNumber: req.body.phone,
            paymentDetails: {
                accountBalance: 0,
                cardNumHash: newCardNumHash,
                lastFourCardNum: lastFourDigit,
                cardName: req.body.cardname,
                creditCardType: req.body.cardtype,
                secNumHash: newSecNumHash,
                expiry: `${req.body.expiremonth}-20${req.body.expireyear}`
            }
        },
        req.body.password,
        (err, user) => {
            if(err){
                console.log(err);
                return res.redirect(500, '/register');
            } else {
                passport.authenticate("local")(req, res, () => {
                    res.redirect(`/user/${req.body.username}`);
                })
            }
        });

        // Save new client - OLD
        /*
        newClient.save((err) => {
            if (err) 
                throw(err);
            res.redirect(301, "/login");
        });
        */
    });
}