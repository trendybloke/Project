module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const Observation = require('../models/Observation');
    const passport = require('passport');
    const path = require('path');

    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }

    app.get('/observations/new', checkAuth, (req, res) => {
        if (req.user.kind == "Client") res.render('../views/newobs.ejs', {username:req.user.username});
    });

    app.get('/observations', checkAuth, (req, res) => {

        let title = req.query.title;
        let analyses = req.query.analyses;
        let order = req.query.date;

        if (order == null) order = "desc"
        if (title == null) title = "";
        if (analyses == null) analyses = "";

        Observation.find({
            title: { $regex: `.*${title}.*`, $options: 'i' },
            analyses: { $regex: `.*${analyses}.*`, $options: 'i' }
        }).sort([["createdAt", order]])
            .exec((err, qry) => {
                if (err) throw err;
                res.render('../views/browse.ejs', { posts: qry, username:req.user.username })
            });
    });

    app.get('/observation', checkAuth, (req, res) => {
        Observation.findById(req.query.id, (err, qry) => {
            if (err) throw err;
            res.render('../views/observation.ejs', { post: qry, username:req.user.username });
        });
    })

    app.post('/observation/new', checkAuth, (req, res) => {
        if (req.user.kind == "Client") {
            const newObs = new Observation({
                username: "Username",
                category: req.body.category,
                title: req.body.title,
                galacticCoords: {
                    longitude: req.body.longitude,
                    latitude: req.body.latitude
                },
                description: req.body.description,
                analyses: req.body.analyses,
                comments: []
            });

            newObs.save((err) => {
                if (err) throw err;
            })

            // MAKE EJS
            res.redirect(301, `/observation/?id=${newObs._id}`)
        }
    });

    app.post('/observation/comment', checkAuth, (req, res) => {
        // Expecting in body:
        // postid
        // username - for now a constant of Username
        // content

        Observation.findById(req.body.postid, (err, qry) => {
            if (err) throw err;
            qry.comments.push({
                username: "Username",
                content: req.body.content
            });

            qry.save();

            //MAKE EJS
            res.redirect(301, `/observation/?id=${req.body.postid}`);
        })
    });
}