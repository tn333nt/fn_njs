const User = require('../models/user');
const Report = require('../models/report');
const deleteFile = require('../middlewares/deleteFile')


// get & check attendance

exports.getAttendance = (req, res, next) => {
    const today = new Date().toISOString().split('T')[0]

    req.user
        .populate('reports.report.reportId')
        .then(user => {
            let report = user.reports.report.find(report => {
                const rpDay = report.reportId.date
                return rpDay.toString() === today.toString()
            })

            if (!report) {
                // always create the default one for updating & add new to userRp
                report = new Report({
                    date: today,
                    startTime: 0,
                    userId: user._id,
                    workMode: false
                })
                return report.save()
                    .then(report => {
                        req.user.addUserReport(report)
                    })
                    .then(() => {
                        return res.render('employee/attendance', {
                            title: 'attendance',
                            path: '/attendance',
                            user: user,
                            report: report
                        })
                            .catch(err => next(err))
                    })
            } else {
                res.render('employee/attendance', {
                    title: 'attendance',
                    path: '/attendance',
                    user: user,
                    report: report?.reportId
                })
            }
        })
        .catch(err => next(err))
}

exports.postCheckIn = (req, res, next) => {
    const now = new Date()
    const workplace = req.body.workplace
    
    // convert time into decimal number
    const time = `${now.getHours()}-${now.getMinutes()}`
    const timeArr = time.split('-');
    const start = (+timeArr[0] + +timeArr[1] / 60).toFixed(2)
    
    const today = now.toISOString().split('T')[0]

    Report.find({ userId: req.user._id })
        .then(reports => {
            // find exactly rp of this user for today
            const rp = reports.find(report => report.date === today)

            return Report.findById(rp._id)
                .then(report => {
                    if (report.startTime === 0) {
                        report.startTime = start
                        report.date = today
                        report.userId = req.user._id
                        report.workplaces = [{ workplace: workplace }]
                        report.workingSessions = [{
                            checkin: start,
                            workplace: workplace,
                        }]
                    } else {
                        report.workplaces.push({ workplace: workplace })
                        report.workingSessions.push({
                            checkin: start,
                            workplace: workplace,
                        })
                    }

                    report.workMode = true

                    return report.save()
                        .then(report => {
                            req.user.updateUserReport(report)
                        })
                })
        })
        .then(() => res.redirect('/attendance'))
        .catch(err => next(err))

}


exports.postCheckOut = (req, res, next) => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    const time = `${now.getHours()}-${now.getMinutes()}`
    const timeArr = time.split('-');
    const finish = (+timeArr[0] + +timeArr[1] / 60).toFixed(2)

    return Report.find({
        userId: req.user._id,
        workMode: true
    })
        .then(reports => {
            // find working today rp of found user
            return Report.findOne({
                _id: reports[0]._id,
                date: today
            })
                .then(report => {
                    if (report.date !== today) return next(new Error('over day'))

                    report.workingSessions.at(-1).checkout = finish
                    report.workingSessions.at(-1).diffTime = (finish - +report.workingSessions.at(-1).checkin).toFixed(2)

                    report.finishTime = finish

                    return report.save()
                })
                .then(report => {
                    // take sum of diffTime of each session
                    const itemsDiffTime = []

                    report.workingSessions.forEach(session => {
                        itemsDiffTime.push(+session.diffTime)
                    })

                    itemsDiffTime.forEach(item => {
                        return report.totalWorkingTime = (+report.totalWorkingTime + +item).toFixed(2)
                    })

                    return report.save()
                })
                .then(report => {
                    report.overTime = +report.totalWorkingTime > 8 ? (+report.totalWorkingTime - 8).toFixed(2) : 0

                    report.totalSummaryTime = (+report.totalWorkingTime + +report.dayLeaveHours.period).toFixed(2)

                    report.underTime = +report.totalSummaryTime < 8 ? (8 - +report.totalSummaryTime).toFixed(2) : 0

                    return report.save()
                })
                .then(report => {
                    // loop through all reports & get the whole result
                    // later : ensure that it's for each month
                    return Report.find({ userId: req.user._id })
                        .then(reports => {
                            let sumOverTime = 0
                            let sumUnderTime = 0
                            reports.map(report => {
                                sumOverTime += +report.overTime
                                sumUnderTime += +report.underTime
                            })
                            report.salary = +(3000000 + ((+sumOverTime - +sumUnderTime) / 8) * 200000).toFixed(0)

                            report.workMode = false

                            return report.save()
                                .then(report => {
                                    req.user.updateUserReport(report)
                                })
                        })
                })
        })
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

exports.getRegisterLeave = (req, res, next) => {
    const userId = req.user._id
    User.findById(userId)
        .then(user => {
            res.render('employee/register-leave', {
                title: 'register-leave',
                path: '/register-leave',
                user: user
            })
        })
}

// get & request daily rp 

exports.getReportDetails = (req, res, next) => {
    const userId = req.params.userId || req.user._id

    const reportsOfSelectedMonth = req.session.reportsOfSelectedMonth
    const reportsPerPage = +req.session.pagination || 1

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
    const userId = req.user._id
    const imgFile = req.file;

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
            user.image ? deleteFile.deleteFile(user.image) : null
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