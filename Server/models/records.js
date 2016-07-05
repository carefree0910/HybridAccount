var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mRecSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    type: String,
    event: String,
    amount: Number,
    unit_price: Number,
    sum: Number,
    date: String,
    milli: Number
});

var tRecSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    type: String,
    event: String,
    points: Number,
    amount: Number,
    date: String,
    milli: Number,
    done_times: [Number]
})

var Record = new Schema({
    tPoints: {
        type: Number,
        default: 0
    },
    mRecords: [mRecSchema],
    tRecords: [tRecSchema],
    tARecords: [tRecSchema]
});

exports.Record = Record;
exports.Record_Model = mongoose.model('Record', Record);