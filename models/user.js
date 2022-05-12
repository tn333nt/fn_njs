const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: Schema.Types.Mixed,
    annualLeave: { type: Number, default: 12 }, // ref each year
    managerId: Schema.Types.ObjectId,
    health: {
        timeRegister: Date,
        temperature: Number,
        vaccination: {
            turn1: { type: String, date: Date },
            turn2: { type: String, date: Date }
        },
        isPositive: Boolean
    },
    // reports: [
    //     {
    //         reportId: {
    //             type: Schema.Types.ObjectId,
    //             ref: 'Report'
    //         }
    //     }
    // ],
    reports: {
        report: [
          {
            reportId: {
              type: Schema.Types.ObjectId,
              ref: 'Report',
              required: true
            }
          }
        ]
    }
    // ,
    // reports: [
    //     {
    //         report: {
    //             reportId: [
    //                 {
    //                     type: Schema.Types.ObjectId,
    //                     ref: 'Report',
    //                     required: true
    //                 }
    //             ]
    //         }
    //     }
    // ]

});


userSchema.methods.updateAnnualLeave = function (report) {
    this.annualLeave -= report.dayLeaveHours.period
    return this.save();
};

module.exports = mongoose.model('User', userSchema);