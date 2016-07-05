var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var User = require('../models/user');
var Verify = require('./verify');

var recRouter = express.Router();
recRouter.use(bodyParser.json());

recRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req, res, next) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        res.json(user.records);
    });
})

recRouter.route('/m')

.put(Verify.verifyOrdinaryUser, function(req, res, next) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        user.records.mRecords = req.body;
        user.save(function(err, resp) {
            if (err) return next(err);
            console.log('Updated mRecords!');
            res.json(resp);
        });
    });
});

recRouter.route('/t')

.put(Verify.verifyOrdinaryUser, function(req, res, next) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        user.records.tRecords = req.body;
        user.save(function(err, resp) {
            if (err) return next(err);
            console.log('Updated tRecords!');
            res.json(resp);
        });
    });
});

recRouter.route('/ta')

.put(Verify.verifyOrdinaryUser, function(req, res, next) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        user.records.tARecords = req.body;
        user.save(function(err, resp) {
            if (err) return next(err);
            console.log('Updated tARecords!');
            res.json(resp);
        });
    });
});

recRouter.route('/tp')

.put(Verify.verifyOrdinaryUser, function(req, res, next) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        user.records.tPoints = req.body.points;
        user.save(function(err, resp) {
            if (err) return next(err);
            console.log('Updated tPoints!');
            res.json(resp);
        });
    });
});

module.exports = recRouter;