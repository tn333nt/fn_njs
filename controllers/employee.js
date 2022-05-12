
const User = require('../models/user');
const Report = require('../models/report');
const deleteFile = require('../middlewares/deleteFile')


// get & check attendance

exports.getAttendance = (req, res, next) => {
    
    console.log(123, req.user);
    req.user
        .populate('reports.report.reportId') // sai path maybe? dungma
        // .deepPopulate('reports.report') 
        .then(user => {
            // const reports = user.reports // []
            const report = user.reports.report.find(report => {
                // find rp today
                return report.reportId.date.toUTCString().split(' 2022 ')[0].trim() === new Date().toUTCString().split(' 2022 ')[0].trim()
            })
            // const reports = user.reports.report[0].reportId // undefined
            console.log(user);
            console.log(report, 'abc') // 2. co rp roi sao ko populate dc ? moi lay dc report
            console.log(report.reportId, '123abc')
            return res.render('employee/attendance', {
                title: 'attendance',
                path: '/attendance',
                user: user,
                report: report.reportId
            })
        })
        .catch(err => next(err))

    // Report.find({userId: req.user._id})
    // .populate('userId')
    // // .exec()
    // .then(reports => {
    //     const user = reports.userId
    //     console.log(user); // undefined => vay la sai cho ref r
    //     return res.render('employee/attendance', {
    //         title: 'attendance',
    //         path: '/attendance',
    //         user: user,
    //         reports: reports
    //     })
    // })
    // .catch(err => next(err))

}

// doi lai tim moi & add ---> update
exports.postCheckIn = (req, res, next) => {
    const now = new Date()
    const workplace = req.body.workplace

    // convert time into decimal number
    const timeArr = now.toLocaleTimeString().replace(/:/g, '-').split('-');
    const start = (+timeArr[0] + +timeArr[1] / 60).toFixed(2)

    Report.find({ userId: req.user._id })
        .then(reports => {
            // find if there is today's report
            const updatedReports = reports.filter(report => report.startTime.toLocaleDateString() === now.toLocaleTimeString()) // to let it return arr

            // add new daily rp 
            if (updatedReports.length <= 0) {
                updatedReports.push({
                    userId: req.user._id,
                    date: new Date(),
                    startTime: start,
                    workplaces: [
                        { workplace: workplace }
                    ],
                    workingSessions: [
                        {
                            checkin: start,
                            workplace: workplace,
                        }
                    ]
                })

                // updatedReports[0].startTime = start
                // updatedReports[0].date = new Date()
                // updatedReports[0].userId = req.user._id
                // updatedReports[0].workplaces = [{ workplace: workplace }]
                // updatedReports[0].workingSessions = [{
                //     checkin: start,
                //     workplace: workplace,
                // }]
                // add workplace & time if start day is matched
            } else {
                updatedReports[0].workplaces.push({ workplace: workplace })
                updatedReports[0].workingSessions.push({
                    checkin: start,
                    workplace: workplace,
                })
            }
            // 3. change work mode
            reports[0].workMode = true
            reports = updatedReports
            return reports.save()

        })
        .then(() => res.redirect('/attendance'))
        .catch(err => next(err))

}

exports.postCheckOut = (req, res, next) => {
    const now = new Date()
    const timeArr = now.toLocaleTimeString().replace(/:/g, '-').split('-');
    const finish = +(+timeArr[0] + +timeArr[1] / 60).toFixed(2)

    Report.find({
        userId: req.user._id,
        workMode: true
    })
        .then(reports => {
            const rp = reports[0]
            if (reports.date.toLocaleDateString() !== now.toLocaleDateString()) return next(new Error('over day'))

            // first time checkout or not -> still have to update all remaining
            // bc once checkin -> have the data

            rp.workingSessions[0].checkout = finish
            rp.workingSessions[0].diffTime = finish - rp.workingSessions[0].checkin

            rp.finishTime = finish

            // 3. sum of diffTime of each session
            const itemsDiffTime = []
            reports.workingSessions.forEach(session => {
                itemsDiffTime.push(session.diffTime)
            })
            itemsDiffTime.forEach(item => {
                return rp.totalWorkingTime += +item
            })
            // // backup
            // let sum = 0
            // const total = itemsDiffTime.forEach(item => {
            //     return sum += +item
            // })
            // rp.totalWorkingTime = total

            rp.workMode = false
            return reports.save()
        })
        .then(reports => {
            const rp = reports[0]

            rp.overTime = rp.totalWorkingTime>8 ? rp.totalWorkingTime - 8 : 0
            
            rp.totalSummaryTime = rp.totalWorkingTime + rp.dayLeaveHours
            
            rp.underTime = rp.totalSummaryTime<8 ? 8 - rp.totalSummaryTime : 0

            return reports.save()
        })
        .then(rp => {
            // loop through all reports & get the whole result
            // later : ensure that is each month

            Report.find({ userId: req.user._id })
            .then(reports => {
                let sumOverTime
                let sumUnderTime
                reports.map(report => {
                    sumOverTime += report.overTime
                    sumUnderTime += report.underTime
                })
                rp[0].salary = +(3000000 + ((+sumOverTime - +sumUnderTime)/8)*200000).toFixed(0)

                return rp.save()
            })

        })
        .then(() => res.redirect('/attendance'))
        .catch(err => next(err))
}


// get & request daily rp 

exports.postSelectedMonth = (req, res, next) => {
    // find & post (to rp-details) in db if any month val of dt === month from req
    const month = req.params.month

    Report.find({ userId: req.user._id })
        .then(reports => {
            const matchedReports = reports.filter(report => +report.date.getMonth() === +month)
            return matchedReports
        })
        .then(reports => {
            // return res.redirect('/report-details')
            if (!reports) {
                return res.redirect('back');
            }
            return res.render('employee/report-details', {
                title: 'report',
                path: '/report-details',
                reports: reports
            });
        })
        .catch(err => next(err))
}

exports.getReportDetails = (req, res, next) => {
    Report.find({ userId: req.user._id })
        .then(reports => {
            if (!reports) {
                return res.redirect('back');
            }
            return res.render('employee/report-details', {
                title: 'report',
                path: '/report-details',
                reports: reports
            });
        })
        .catch(err => next(err))
}

exports.postRegisterLeave = (req, res, next) => {
    const reportId = req.params.reportId
    const period = req.body.period;
    const reason = req.body.reason;

    req.user
        .populate('reports.reportId')
        .then(user => {
            // 1. add leave hour for dayReport
            const reports = user.reports
            return reports.findById(reportId)
                .then(report => {
                    report.dayLeaveHours = {
                        period: period,
                        reason: reason,
                    }
                    return report.save()
                })
        })
        // 2. update aL
        .then(report => req.user.updateAnnualLeave(report))
        .then(() => res.redirect('back'))
        .catch(err => next(err))
};


// up , store & serve file

exports.postProfile = (req, res, next) => {
    const imgFile = req.file;

    if (!imgFile) {
        return res.status(422).render('employee/profile', {
            title: 'profile',
            path: '/profile',
            errMsg: 'check the file'
        });
    }

    User.findById(req.user._id)
        .then(user => {
            if (!imgFile) {
                res.redirect('back')
            }
            user.image && deleteFile.deleteFile(user.image)
            return user.save();
        })
        .then(user => {
            user.image = '/images/' + imgFile.filename
            return user.save();
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
};

exports.getProfile = (req, res, next) => {
    User.findById(req.user._id)
        .then(user => {
            res.render('employee/profile', {
                title: 'profile',
                path: '/profile',
                user: user,
                errMsg: null
            });
        })
        .catch(err => next(err))
};


// post health info & extract it into file

exports.postHealthDeclaration = (req, res, next) => {
    const temperature = req.body.temperature;
    const timeRegister = req.body.timeRegister;
    const injectionType1 = req.body.injectionType1;
    const injectionDate1 = req.body.injectionDate1;
    const injectionType2 = req.body.injectionType2;
    const injectionDate2 = req.body.injectionDate2;
    const isPositive = req.body.isPositive;
    // validate later

    User.findById(req.user._id)
        .then(user => {
            user.health = {
                timeRegister: timeRegister,
                temperature: temperature,
                vaccination: {
                    turn1: {
                        type: injectionType1,
                        date: injectionDate1
                    },
                    turn2: {
                        type: injectionType2,
                        date: injectionDate2
                    }
                },
                isPositive: isPositive
            }
            return user.save()
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
};

exports.getHealthDeclaration = (req, res, next) => {
    console.log(req.user);
    // User.findById(req.user._id)
    //     .then(user => {
    //         return res.render('employee/health-declaration', {
    //             title: 'health-declaration',
    //             path: '/health-declaration',
    //             user: user
    //         });
    //     })
    //     .catch(err => next(err))
}