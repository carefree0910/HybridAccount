var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Info = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    income: Number,
    icon: String,
    avatar: String,
    lang: String,
    description: String
});

exports.Info = Info;
exports.Info_Model = mongoose.model('Info', Info);