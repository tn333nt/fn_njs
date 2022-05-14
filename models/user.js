const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Report = require('./report')

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
      turn1: { type1: String, date1: Date },
      turn2: { type2: String, date2: Date }
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
});


userSchema.methods.updateAnnualLeave = function (report) {
  const time = +report.dayLeaveHours.period/24

  this.annualLeave = (+this.annualLeave - +time).toFixed(2)
  return this.save();
};

userSchema.methods.addUserReport = function (report) {
  this.reports.report.push({reportId : report})
  return this.save();
};

userSchema.methods.updateUserReport = function (report) {
  // update latest report
  this.reports.report.at(-1).reportId = report
  return this.save();
};

module.exports = mongoose.model('User', userSchema);