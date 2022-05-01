module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const Observation = require('../models/Observation');
    const passport = require('passport');
    const path = require('path');
    const moment = require('moment');

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
        if (req.user.kind == "Client") 
            res.render('../views/newobs.ejs', {
                current: "post",
                username:req.user.username,
                kind: "Client"
            });
    });

    app.get('/observations', checkAuth, (req, res) => {

        let title = req.query.title;
        let analyses = req.query.analyses;
        let order = req.query.date;

        let userCanSee;
        if(req.user.kind == "Client")
            userCanSee = ["visible", "flagged"]
        else
            userCanSee = ["visible", "flagged", "removed"]

        if (order == null) order = "desc"
        if (title == null) title = "";
        if (analyses == null) analyses = "";

        Observation.find({
            title: { $regex: `.*${title}.*`, $options: 'i' },
            analyses: { $regex: `.*${analyses}.*`, $options: 'i' },
            status: { $in: userCanSee }
        }).sort([["createdAt", order]])
            .exec((err, qry) => {
                if (err) throw err;
                res.render('../views/browse.ejs', { 
                    posts: qry, 
                    username:req.user.username,
                    current: "",
                    kind: req.user.kind,
                    moment: moment
                })
            });
    });

    app.get('/observation', checkAuth, (req, res) => {
        Observation.findById(req.query.id, (err, qry) => {
            if (err) throw err;

            var clientCanSeePost = qry.status == "visible" || qry.status == "flagged";

            var isClientsPost = req.user.username == qry.username;

            var supportCanSeePost = qry.status == "removed" && req.user.kind == "Support";

            if(clientCanSeePost || supportCanSeePost || isClientsPost)
                res.render('../views/observation.ejs', { 
                    post: qry, 
                    username:req.user.username,
                    current: "",
                    kind: req.user.kind,
                    moment: moment
                });
            else if(qry.status == "removed" && req.user.kind == "Client")
                res.render('../views/obserror.ejs', {
                    username: req.user.username,
                    current: "",
                    kind: req.user.kind,
                    message: "Post was removed."
                });
            else
                res.render('../views/obserror.ejs', {
                    username: req.user.username,
                    current: "",
                    kind: req.user.kind,
                    message: "Access denied."
                })
        });
    })

    app.post('/observation/delete/:id', checkAuth, (req, res) => {
        Observation.findById(req.params.id, (err, qry) => {
            if(err) throw err;

            let usernameMatch = req.user.username == qry.username;
            let supportUser = req.user.kind == "Support"

            // Determine if requesting user is able to delete this post
            if(usernameMatch || supportUser){
                    // If  they are, then set the status to removed.
                    qry.status = "removed";

                    qry.save();

                    res.redirect(`/observation/?id=${qry._id}`);
            }
            else
                res.redirect('/observations');
        })
    })

    app.post('/observation/new', checkAuth, (req, res) => {
        if (req.user.kind == "Client") {
            const newObs = new Observation({
                username: req.user.username,
                category: req.body.category,
                title: req.body.title,
                galacticCoords: {
                    longitude: req.body.longitude,
                    latitude: req.body.latitude
                },
                description: req.body.description,
                analyses: req.body.analyses,
                comments: [],
                status: req.body.status
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
        // content

        Observation.findById(req.body.postid, (err, qry) => {
            if (err) throw err;
            qry.comments.push({
                username: req.user.username,
                content: req.body.content
            });

            qry.save();

            //MAKE EJS
            res.redirect(301, `/observation/?id=${req.body.postid}`);
        })
    });
}