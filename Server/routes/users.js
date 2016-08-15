var express = require('express');
var router = express.Router();
var passport = require('passport');
var bodyParser = require('body-parser');
var User = require('../models/user');
var Rec = require('../models/records');
var Info = require('../models/info');
var Verify = require('./verify');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    User.find({}, function (err, user) {
        if (err) throw err;
        res.json(user);
    });
});

userRouter.route('/register')
.post(function(req, res) {

    var records = new Rec.Record_Model();
    var info = new Info.Info_Model({ username: req.body.username });
    var user = new User({ username: req.body.username, info: info, records: records });
    
    var password = req.body.password;

    User.register(user, password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        user.save(function(err, user) {
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });
    });
});

userRouter.route('/login')
.post(function(req, res, next) {
    console.log("in login")
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ err: info });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            
            var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req,res,next);
});

userRouter.route('/logout')
.post(function(req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

userRouter.route('/info')
.all(Verify.verifyOrdinaryUser)

.get(function(req, res) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        res.json(user.info);
    });
})

.put(function(req, res) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        user.info = req.body;
        user.username = req.body.username;
        user.save(function(err, resp) {
            if (err) return next(err);
            console.log('Updated Info!');
            res.json(resp);
        });
    });
});

module.exports = userRouter;