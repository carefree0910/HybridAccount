var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Info = new Schema({
    username: String,
    income: Number,
    icon: String,
    lang: String
});

exports.Info = Info;
exports.Info_Model = mongoose.model('Info', Info);