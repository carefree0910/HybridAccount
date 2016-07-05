var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Rec = require('./records');
var Info = require('./info');

var User = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    info: Info.Info,
    records: Rec.Record
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);