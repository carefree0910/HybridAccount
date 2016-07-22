var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    body: String
});

var mRecSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    type: String,
    tags: [tagSchema],
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
});

var Template = new Schema({
    id: {
        type: Number,
        required: true
    },
    type: String,
    event: String,
    points: Number,
    amount: Number,
    unit_price: Number,
    sum: Number,
    date: String,
    milli: Number,
    done_times: [Number],
    triggered: {
        type: Boolean,
        default: false
    }
});

var Record = new Schema({
    tPoints: {
        type: Number,
        default: 0
    },
    tags: [tagSchema],
    mRecords: [mRecSchema],
    tRecords: [tRecSchema],
    tARecords: [tRecSchema],
    trRecords: [tRecSchema],
    mtRecords: [Template]
});

exports.Record = Record;
exports.Record_Model = mongoose.model('Record', Record);