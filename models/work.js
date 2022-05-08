const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workSchema = new Schema({
    date: { type: Date, required: true },
    workplace: { type: String, required: true },
    startTime: { type: Number, required: true },
    finishTime: { type: Number, required: true },
    totalWorkingTime: { type: Number, required: true },
    overTime: { type: Number, required: true },
    annualLeave: { type: Number, required: true },
    totalSummaryTime: { type: Number, required: true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Work',
        required: true
    }
});

module.exports = mongoose.model('Work', workSchema);