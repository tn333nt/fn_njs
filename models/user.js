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


// // 1. 
// userSchema.methods.postCheckIn = function(workplace) {
//   const now = new Date()

//   // convert time into decimal number
//   const timeArr = now.toLocaleTimeString().replace(/:/g, '-').split('-');
//   const start = (+timeArr[0] + +timeArr[1] / 60).toFixed(2)

//   return Report.findById(this._id)
//   .then(reports => {
//     const updatedReports = reports.filter(report => {
//         console.log('...', report.startTime);
//         return report.startTime.toLocaleDateString() === now.toLocaleTimeString() 
//     }) // to let it return arr


//     // add new daily rp 
//     if (updatedReports.length <= 0) {
//         updatedReports.push({
//             userId: this._id,
//             date: new Date(),
//             startTime: start,
//             workplaces: [
//                 { workplace: workplace }
//             ],
//             workingSessions: [
//                 {
//                     checkin: start,
//                     workplace: workplace,
//                 }
//             ]
//         })

//         // updatedReports[0].startTime = start
//         // updatedReports[0].date = new Date()
//         // updatedReports[0].userId = this._id
//         // updatedReports[0].workplaces = [{ workplace: workplace }]
//         // updatedReports[0].workingSessions = [{
//         //     checkin: start,
//         //     workplace: workplace,
//         // }]
//         // add workplace & time if start day is matched
//     } else {
//         updatedReports[0].workplaces.push({ workplace: workplace })
//         updatedReports[0].workingSessions.push({
//             checkin: start,
//             workplace: workplace,
//         })
//     }
//     // 3. change work mode
//     reports[0].workMode = true
//     reports = updatedReports
//     return reports.save();
//   })
// };

// userSchema.methods.postCheckOut = function(userId) {
// };


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

  // how to find exactly which rp to update
  // maybe
  // thuong thi da tim rp cho hn va add vao r
  // thi no se push vao cuoi
  // va update thi chi update cho rp hn thoi
  // =>  can update cai lastest rp la dc
  this.reports.report.at(-1).reportId = report
  return this.save();
};

module.exports = mongoose.model('User', userSchema);