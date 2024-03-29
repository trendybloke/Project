module.exports = (app) => {
    const Obs = require('../models/Observation');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const passport = require('passport/lib');
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    // Basic hello world.
    /*
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
    */

    // Creates an observation object, stores it, and sends text to the screen
    // if successful.
    app.get('/newobs', (req, res) => {
        const NewObs = new Obs({
            username: "Username",
            category: "elliptical",
            title: "Title",
            galacticCoords: {
                longitude: 0,
                latitude: 0
            },
            description: "Description",
            analyses: [],
            comments: [
                {
                    username: "OtherUsername",
                    content: "Cool!"
                }
            ]
        });

        NewObs.save((err) => {
            if (err) 
                throw(err);
            

            console.log("New observation saved")
            res.send('Success!')
        });
    });

    // Creates a new default Client user, stores it, sends results to screen
    app.get('/newclient', (req, res) => {
        const NewClient = new Client({
            // User information
            username: "Username",
            email: "email@address.com",
            passHash: "secretinformation",
            forename: "Client",
            surname: "User",
            address: {
                houseName: "1",
                street: "House Lane",
                town: "Town",
                postcode: "AA1 9ZZ"
            },
            // Client information
            accountStatus: "active",
            accountType: "individual",
            notificationPreference: "email",
            phoneNumber: "",
            paymentDetails: {
                accountBalance: 9999,
                cardNumHash: "supersecretinformation",
                cardName: "C. USER",
                creditCardType: "debit",
                secNumHash: "reallysupersecretinformation"
            }
        });

        NewClient.save((err) => {
            if (err) 
                throw(err);
            

            console.log("New client saved")
            res.send('Success!')
        });
    });

    // Creates a new default Support user, stores it, sends results to screen
    app.get('/newsupport', (req, res) => {

        const salt = bcrypt.genSaltSync(saltRounds);
        const newPassHash = bcrypt.hashSync("secretpassword", salt);

        Support.register({
            // User information
            username: "Support",
            email: "address@email.com",
            passHash: newPassHash,
            forename: "Support",
            surname: "User",
            address: {
                houseName: "9",
                street: "House Lane",
                town: "Town",
                postcode: "ZZ9 1AA"
            },
            accountStatus: "active",
            // Support information
            chats: [
                {
                    clientUsername: "Username",
                    messages: [
                        {
                            senderUsername: "Username",
                            content: "Please help!"
                        }
                    ]
                }
            ]
        },
        "secretpassword",
        (err, user) => {
            if(err){
                console.log(err);
                return res.redirect(500, '/login');
            }
            else{
                passport.authenticate("local")(req, res, () => {
                    res.redirect('/login');
                })
            }
        });

        /*
        NewSupport.save((err) => {
            if (err)
                throw (err);
            
            console.log("New support saved");
            res.send("Success!");
        });
        */
    });
}
