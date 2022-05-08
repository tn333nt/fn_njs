const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    startSession: { type: Date, required: true },
    finishSession: { type: Date, required: true },
    workId: {
        type: Schema.Types.ObjectId,
        ref: 'Work',
        required: true
    }
})

module.exports = mongoose.model('workingSession', sessionSchema)