const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    date: { type: Date, required: true },
    workplace: { type: String, required: true },
    startTime: { type: Number, required: true },
    finishTime: Number,
    totalWorkingTime: Number,
    overTime: Number,
    dayLeaveHours: { // ref each day
        period: { type: Number, min: 0, max: 8 },
        reason: String,
    }, // chon ngay nao thi se tinh aL vao report hom do
    // 1. ti populate cai tk aL ra xong tru from value above
    // 2. xong con phai condition trung ngay nua
    totalSummaryTime: Number,
    salary: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workingSessions: {
        session: [
            {
                checkin: { type: Schema.Types.Date, default: Date.now },
                checkout: Date,
                diffTime: Number
            }
        ]
    } // de vay thi each ss van gen dc id rieng thi phai
});

module.exports = mongoose.model('Report', reportSchema);