const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    appliedDate: { type: Date, ref: 'Report', required: true },
    period: { type: Number, required: true, min: 1, max: 8 },
    reason: String,
});

// neu vay thi biet cai nao cua ngay de tinh tong cai nao cua nam de tham chieu

module.exports = mongoose.model('Leave', LeaveSchema);