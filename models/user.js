const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: String,
    annualLeave: { type: Number, default: 12 },
    managerId: Schema.Types.ObjectId,
    health: { 
        timeRegister: Date,
        temperature: Number,
        vaccination: {
            turn1: { type: String, date: Date },
            turn2: { type: String, date: Date }
          },
        isPositive: Boolean
    }
});

module.exports = mongoose.model('User', userSchema);