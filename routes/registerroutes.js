module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const path = require('path');
    const hash = require('object-hash')

    app.post("/register", (req, res) => {
        res.sendFile(path.join(__dirname, '../public/html', 'register.html'));
    });

    app.post("/register/parse", (req, res) => {
        console.log("POST /register/parse reached...")
        // Form validation
        /// Matching passwords
        console.log("checking passwords match...")
        if(req.body.password !== req.body.confirmpassword){
            console.log("password mismatch!")
            res.send("Failure!: passwords don't match!")
            return;
        }
        console.log("passwords match!")
        // Get last four digits of cardnum
        console.log("getting last 4 numbers on card...")
        let lastFourDigit = req.body.cardnum.substr(req.body.cardnum - 4);
        console.log(`got last 4 numbers: ${lastFourDigit}`);

        // Client creation
        console.log("creating client...");
        const newClient = Client({
            username: req.body.username,
            email: req.body.email,
            passHash: hash(req.body.password),
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
                cardNumHash: hash(req.body.cardnum),
                lastFourCardNum: lastFourDigit,
                cardName: req.body.cardname,
                creditCardType: req.body.cardtype,
                secNumHash: hash(req.body.ccv),
                expiry: `${req.body.expiremonth}-20${req.body.expireyear}`
            }
        });
        console.log("created client!");

        console.log("saving client...");
        // Save new client
        newClient.save((err) => {
            if (err) 
                throw(err);

            console.log("New client saved")
            res.redirect(301, "/login");
        });
    });
}