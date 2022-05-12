const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    date: { type: Date, required: true },
    workplaces: [
        {
            workplace: String
        }
    ],
    startTime: { type: Number, required: true, default: 0 },
    finishTime: Number,
    totalWorkingTime: Number,
    overTime: Number,
    underTime: Number,
    dayLeaveHours: { // ref each day
        period: { type: Number, min: 0, max: 8, default: 0 },
        reason: String
    },
    totalSummaryTime: Number,
    salary: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workingSessions: [
        {
            checkin: Date,
            checkout: Date,
            workplace: String,
            diffTime: Number
        }
    ],
    editMode: { type: Boolean, default: true },
    workMode: { type: Boolean, default: false }
});

module.exports = mongoose.model('Report', reportSchema);