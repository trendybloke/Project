const { post } = require('../models/Address');

module.exports = (app) => {
    const mongoose = require('../config/dbconfig');
    const User = require('../models/User');
    const Client = require('../models/Client');
    const Support = require('../models/Support');
    const Observation = require('../models/Observation');
    const path = require('path');

    app.get('/observations/new', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/html', 'newobs.html'));
    });

    app.get('/observations', (req, res) => {

        let title = req.query.title;
        let analyses = req.query.analyses;
        let order = req.query.date;

        if (order == null) order = "desc"
        if (title == null) title = "";
        if (analyses == null) analyses = "";

        Observation.find({
            title: { $regex: `.*${title}.*`, $options: 'i' },
            analyses: { $regex: `.*${analyses}.*`, $options: 'i' }
        })  .sort([["createdAt", order]])
            .exec((err, qry) => {
                if (err) throw err;
                res.render('../views/browse.ejs', { posts: qry })
            });
    });

    app.get('/observation', (req, res) => {
        Observation.findById(req.query.id, (err, qry) => {
            if (err) throw err;
            res.render('../views/observation.ejs', { post: qry });
        });
    })

    app.post('/observation/new', (req, res) => {
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

        res.redirect(301, `/observation/?id=${newObs._id}`)
    });

    app.post('/observation/comment', (req, res) => {
        // Expecting in body:
            // postid
            // username - for now a constant of Username
            // content

        Observation.findById(req.body.postid, (err, qry) => {
            if(err) throw err;
            qry.comments.push({
                username: "Username",
                content: req.body.content
            });

            qry.save();

            res.redirect(301, `/observation/?id=${req.body.postid}`);
        })
    });
}