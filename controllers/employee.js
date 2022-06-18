const User = require('../models/user');
const Report = require('../models/report');
const deleteFile = require('../middlewares/deleteFile')


// get & check attendance

exports.getAttendance = (req, res, next) => {
    const today = new Date().toISOString().split('T')[0]

    req.user
        .populate('reports.report.reportId')
        .then(user => {
            const report = user.reports.report.find(report => {
                if (report.reportId) {
                    const rpDay = report.reportId.date
                    return rpDay.toString() === today.toString()
                }
            })

            res.render('employee/attendance', {
                title: 'attendance',
                path: '/attendance',
                user: user,
                report: report?.reportId
            })
        })
        .catch(err => next(err))
}

exports.postCheckIn = (req, res, next) => {
    const now = new Date()
    const workplace = req.body.workplace
    const userId = req.user._id

    // convert time into decimal number
    const time = `${now.getHours()}-${now.getMinutes()}`
    const timeArr = time.split('-');
    const start = (+timeArr[0] + +timeArr[1] / 60).toFixed(2)

    const today = now.toISOString().split('T')[0]

    Report.find({ userId: userId })
        .then(reports => {
            // find exact rp of this user for today
            const rp = reports.find(report => report.date === today)

            if (!rp) {
                const report = new Report({
                    date: today,
                    userId: userId,
                    workMode: true,
                    startTime: start,
                    workplaces: [{ workplace: workplace }],
                    workingSessions: [{
                        checkin: start,
                        workplace: workplace,
                    }]
                })
                console.log(report, 2);

                return report.save()
                    .then(report => {
                        req.user.addUserReport(report)
                    })
                    .catch(err => next(err))

            } else {

                return Report.findById(rp._id)
                    .then(report => {

                        report.workplaces.push({ workplace: workplace })
                        report.workingSessions.push({
                            checkin: start,
                            workplace: workplace,
                        })
                        report.workMode = true

                        return report.save()
                            .then(report => {
                                console.log(report, 3);
                                req.user.updateUserReport(report)
                            })
                    })

            }

        })
        .then(() => res.redirect('/attendance'))
        .catch(err => next(err))

}

// update the latest one
exports.postCheckOut = (req, res, next) => {
    const userId = req.user._id

    const now = new Date()
    const today = now.toISOString().split('T')[0]

    const time = `${now.getHours()}-${now.getMinutes()}`
    const timeArr = time.split('-');
    const finish = (+timeArr[0] + +timeArr[1] / 60).toFixed(2)

    return Report.findOne({
        userId: userId,
        workMode: true
    })
        .then(report => {
            console.log(report.date, 11);
            console.log(today, 12);
            console.log(report.workingSessions.length, 13);
            if (report.workingSessions.length <= 1 && report.date !== today) {
                console.log(1);
                return Report.deleteOne({
                    userId: userId,
                    workMode: true
                })

            } else if (report.workingSessions.length > 1 && report.date !== today) {
                console.log(2);
                report.workingSessions.at(-1).remove((err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Result :", result)
                    }
                })
                report.workMode = false

                return report.save()
                    .then(report => {
                        req.user.updateUserReport(report)
                    })

            } else {
                console.log(3);
                report.workingSessions.at(-1).checkout = +finish
                report.workingSessions.at(-1).diffTime = (+finish - +report.workingSessions.at(-1).checkin).toFixed(2)

                report.finishTime = +finish

                // take sum of diffTime of each session
                let itemsDiffTime = 0
                report.workingSessions.forEach(session => {
                    itemsDiffTime = +itemsDiffTime + +session.diffTime
                })

                report.totalWorkingTime = +itemsDiffTime.toFixed(2)

                report.overTime = +report.totalWorkingTime > 8 ? (+report.totalWorkingTime - 8).toFixed(2) : 0

                report.totalSummaryTime = (+report.totalWorkingTime + +report.dayLeaveHours.period).toFixed(2)

                report.underTime = +report.totalSummaryTime < 8 ? (8 - +report.totalSummaryTime).toFixed(2) : 0

                // loop through all reports & get the whole result
                return Report.find({ userId: userId })
                    .then(reports => {
                        // get total over & under h of this month
                        let sumOverTime = 0
                        let sumUnderTime = 0
                        reports.map(rp => {
                            if (+rp.date.split('-')[1] === +today.split('-')[1]) {
                                if (rp.overTime) {
                                    sumOverTime += +rp.overTime
                                } else if (rp.underTime) {
                                    sumUnderTime += +rp.underTime
                                }
                            }
                        })

                        const salary = 3000000 + ((+sumOverTime - +sumUnderTime) / 8) * 200000

                        report.salary = +salary.toFixed(0)
                        report.workMode = false

                        return report.save()
                            .then(report => {
                                req.user.updateUserReport(report)
                            })
                    })

            }

            // return report.save()
        })
        // .then(report => {
        //     // take sum of diffTime of each session
        //     let itemsDiffTime = 0
        //     report.workingSessions.forEach(session => {
        //         itemsDiffTime = +itemsDiffTime + +session.diffTime
        //         console.log(itemsDiffTime, 1);
        //         console.log(+session.diffTime, 2);

        //     })
        //     console.log(itemsDiffTime, 3);

        //     report.totalWorkingTime = +itemsDiffTime.toFixed(2)
        //     console.log(report.totalWorkingTime, 4);

        //     return report.save()
        // })
        // .then(report => {
        //     report.overTime = +report.totalWorkingTime > 8 ? (+report.totalWorkingTime - 8).toFixed(2) : 0

        //     report.totalSummaryTime = (+report.totalWorkingTime + +report.dayLeaveHours.period).toFixed(2)

        //     report.underTime = +report.totalSummaryTime < 8 ? (8 - +report.totalSummaryTime).toFixed(2) : 0

        //     console.log(report.overTime, 'overTime');
        //     console.log(report.totalSummaryTime, 'totalSummaryTime');
        //     console.log(report.underTime, 'underTime');
        //     return report.save()
        // })
        // .then(report => {
        //     // loop through all reports & get the whole result
        //     return Report.find({ userId: userId })
        //         .then(reports => {
        //             // get total over & under h of this month
        //             let sumOverTime = 0
        //             let sumUnderTime = 0
        //             reports.map(rp => {
        //                 if (+rp.date.split('-')[1] === +today.split('-')[1]) {
        //                     if (rp.overTime) {
        //                         sumOverTime += +rp.overTime
        //                     } else if (rp.underTime) {
        //                         sumUnderTime += +rp.underTime
        //                     }
        //                 }
        //             })
        //             console.log(sumOverTime, 'sumOverTime');
        //             console.log(sumUnderTime, 'sumUnderTime');

        //             const salary = 3000000 + ((+sumOverTime - +sumUnderTime) / 8) * 200000
        //             console.log(salary, 'salary');

        //             report.salary = +salary.toFixed(0)
        //             report.workMode = false

        //             return report.save()
        //                 .then(report => {
        //                     req.user.updateUserReport(report)
        //                 })
        //         })
        // })
        .then(() => res.redirect('/attendance'))
        .catch(err => next(err))
}


exports.postRegisterLeave = (req, res, next) => {
    const reason = req.body.reason;
    const dayRegister = req.body.dayRegister
    const hourRegister = req.body.hourRegister
    const userId = req.user._id

    Report.findOne({
        date: dayRegister,
        userId: userId,
    })
        .then(report => {
            report.dayLeaveHours = {
                period: hourRegister,
                reason: reason,
            }
            report.totalSummaryTime = (+report.totalWorkingTime + +report.dayLeaveHours.period).toFixed(2)
            return report.save()
        })
        .then(report => req.user.updateAnnualLeave(report))
        .then(() => res.redirect('back'))
        .catch(err => next(err))
};


// get & request daily rp 

exports.getReportDetails = (req, res, next) => {
    const userId = req.user._id

    const reportsOfSelectedMonth = req.session.reportsOfSelectedMonth
    const reportsPerPage = +req.session.pagination || 3

    const page = +req.query.page || 1
    let totalReports

    Report.find({ userId: userId })
        .countDocuments()
        .then(countReports => {
            totalReports = countReports
            return Report.find({ userId: userId })
                .skip((page - 1) * reportsPerPage)
                .limit(reportsPerPage)
        })
        .then(reports => {
            return res.render('employee/report-details', {
                title: 'report',
                path: '/report-details',
                reports: reports,
                userId: userId,
                hasNextPage: reportsPerPage * page < totalReports,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                currentPage: page,
                lastPage: Math.ceil(totalReports / reportsPerPage),
                reportsOfSelectedMonth: reportsOfSelectedMonth
            });
        })
        .catch(err => next(err))
}

// append salary value for each day => take the latest for the whole month
exports.postSelectedMonth = (req, res, next) => {
    const userId = req.user._id
    const month = req.body.month

    Report.find({ userId: userId })
        .then(reports => {
            // get all rp of this selected month
            const reportsOfSelectedMonth = reports.filter(report => +report.date.split('-')[1] === +month)
            return reportsOfSelectedMonth
        })
        .then(reportsOfSelectedMonth => {
            req.session.reportsOfSelectedMonth = reportsOfSelectedMonth

            return req.session.save(() => {
                res.redirect('/report-details');
            })
        })
        .catch(err => next(err))
}

exports.postNumberOfReport = (req, res, next) => {
    const pagination = req.body.pagination

    req.session.pagination = pagination

    return req.session.save(() => {
        res.redirect('/report-details');
    })
}

// up , store & serve file

exports.postProfile = (req, res, next) => {
    console.log(123);
    const userId = req.user._id
    const imgFile = req.file;

    console.log(imgFile, 123456);

    if (!imgFile) {
        return res.status(422).render('employee/profile', {
            title: 'profile',
            path: '/profile',
            errMsg: 'check the file'
        });
    }
    User.findById(userId)
        .then(user => {
            if (!imgFile) {
                res.redirect('back')
            }
            // user.image ? deleteFile.deleteFile(user.image) : null
            if (user.image) {
                console.log(user.image, 'user.image');
                console.log(imgFile, 'imgFile');
                deleteFile.deleteFile(user.image)
            }
            return user.save();
        })
        .then(user => {
            user.image = imgFile.path
            return user.save();
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
};

exports.getProfile = (req, res, next) => {
    const userId = req.user._id

    User.findById(userId)
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
    // later : validate

    const userId = req.user._id

    User.findById(userId)
        .then(user => {
            user.health = {
                timeRegister: timeRegister,
                temperature: temperature,
                vaccination: {
                    turn1: {
                        type1: injectionType1,
                        date1: injectionDate1
                    },
                    turn2: {
                        type2: injectionType2,
                        date2: injectionDate2
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
    const managerId = '627c644af847400f53e77fe0'
    User.find()
        .where('_id').ne(managerId)
        .then(users => {
            res.render('employee/health-declaration', {
                title: 'health-declaration',
                path: '/health-declaration',
                users: users
            });
        })
        .catch(err => next(err))
}