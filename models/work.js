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
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        managerId: { type: Schema.Types.ObjectId, ref: 'User'} // xem lai cho populate
    },
    workingSessions: {
        session: [
            {
                startSession: { type: Schema.Types.Date, default: Date.now },
                finishSession: Date,
                totalWorkingTime: Number
            }
        ]
    } // de vay thi each ss van gen dc id rieng thi phai
});

module.exports = mongoose.model('Work', workSchema);