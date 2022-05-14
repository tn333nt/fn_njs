const mongoose = require('mongoose');

const User = require('../models/user');
const Report = require('../models/report');
const deleteFile = require('../middlewares/deleteFile')


// get & check attendance

exports.getAttendance = (req, res, next) => {
    // console.log(123, req.user);
    // console.log(1423523, req.user.reports.report);

    const today = new Date().toISOString().split('T')[0]

    req.user
        .populate('reports.report.reportId') // hinh nhu no chi populate co ngay dautien //
        .then(user => {
            console.log(user.reports.report, 'user.reports.report haajka');
            let report = user.reports.report.find(report => {
                const rpDay = report.reportId.date
                console.log(rpDay, 'rpDay');
                console.log(today, 'today');
                return rpDay.toString() === today.toString()
            })

            console.log('report from page after post checkin' + report)

            if (!report) {
                // always create the default one for updating & add new to userRp
                report = new Report({
                    date: today,
                    startTime: 0,
                    userId: user._id,
                    workMode: false
                })
                console.log(report, 'report');
                return report.save()
                    .then(report => {
                        console.log(report, 11111111111111);
                        req.user.addUserReport(report) // ok :D
                    })
                    .then(() => {
                        return res.render('employee/attendance', {
                            title: 'attendance',
                            path: '/attendance',
                            user: user,
                            report: report // chay roai :D
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

            console.log(report, 546563261);

        })
        .catch(err => next(err))
}

// doi lai tim moi & add ---> update
exports.postCheckIn = (req, res, next) => {
    const now = new Date()
    const workplace = req.body.workplace

    // convert time into decimal number
    const time = `${now.getHours()}-${now.getMinutes()}`
    console.log(time, 'time');
    const timeArr = time.split('-');
    console.log(timeArr, 'timeArr');

    const start = (+timeArr[0] + +timeArr[1] / 60).toFixed(2)
    console.log(start, 'start');

    const today = now.toISOString().split('T')[0]

    console.log(today, 56565655656);

    Report.find({ userId: req.user._id })
        .then(reports => {
            console.log(reports, 123213213213);
            // find exactly rp of this user for today
            const rp = reports.find(report => report.date === today)

            console.log(rp, 'adasa');

            return Report.findById(rp._id)
                .then(report => {
                    console.log(report, 'report 1');

                    if (report.startTime === 0) {
                        report.startTime = start
                        report.date = today
                        report.userId = req.user._id
                        report.workplaces = [{ workplace: workplace }]
                        report.workingSessions = [{
                            checkin: start,
                            workplace: workplace,
                        }]
                        // add workplace & time if start day is matched
                    } else {
                        report.workplaces.push({ workplace: workplace })
                        report.workingSessions.push({
                            checkin: start,
                            workplace: workplace,
                        })
                    }

                    console.log('report 2', report);
                    report.workMode = true
                    console.log('report 3', report);

                    console.log('report 4 from postCheckIn', report);

                    // reports = updatedReports
                    return report.save()
                        .then(report => {
                            console.log(report, 88888888);
                            req.user.updateUserReport(report)
                        })

                })


            // console.log(reports,123123)

            // add new daily rp 
            // if (updatedReports.length <= 0) {
            //     updatedReports.push({
            //         userId: req.user._id,
            //         date: new Date(),
            //         startTime: start,
            //         workplaces: [
            //             { workplace: workplace }
            //         ],
            //         workingSessions: [
            //             {
            //                 checkin: start,
            //                 workplace: workplace,
            //             }
            //         ]
            //     })

            //     // updatedReports[0].startTime = start
            //     // updatedReports[0].date = new Date()
            //     // updatedReports[0].userId = req.user._id
            //     // updatedReports[0].workplaces = [{ workplace: workplace }]
            //     // updatedReports[0].workingSessions = [{
            //     //     checkin: start,
            //     //     workplace: workplace,
            //     // }]
            //     // add workplace & time if start day is matched
            // } else {
            //     updatedReports[0].workplaces.push({ workplace: workplace })
            //     updatedReports[0].workingSessions.push({
            //         checkin: start,
            //         workplace: workplace,
            //     })
            // }
            // // console.log('reports[0]', reports[0]);
            // // 3. change work mode
            // console.log('updatedReports', updatedReports);
            // console.log('reports', reports);

            // // reports = updatedReports[0]
            // // reports = new Report(updatedReports[0])
            // reports.workMode = true
            // console.log('reports', reports);

            // console.log('reports[0] at assign', reports);
            // return reports.save() 

        })
        .then(() => res.redirect('/attendance'))
        .catch(err => next(err))

}

// h dang loi r, ti nho if time pm -> h + 11

exports.postCheckOut = (req, res, next) => {
    console.log(28425);
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    const time = `${now.getHours()}-${now.getMinutes()}`
    console.log(time, 'time');
    const timeArr = time.split('-');
    console.log(timeArr, 'timeArr');

    const finish = (+timeArr[0] + +timeArr[1] / 60).toFixed(2)
    console.log(finish, 'finish');


    return Report.find({
        userId: req.user._id,
        workMode: true
    })
        .then(reports => {
            console.log(reports, 'reports');
            return Report.findOne({
                _id: reports[0]._id,
                date: today
            })
                .then(report => {
                    // console.log(report, 'report');

                    // const rp = reports[0]
                    if (report.date !== today) return next(new Error('over day'))

                    // first time checkout or not -> still have to update all remaining
                    // bc once checkin -> have the data

                    report.workingSessions.at(-1).checkout = finish
                    report.workingSessions.at(-1).diffTime = (finish - +report.workingSessions.at(-1).checkin).toFixed(2)

                    report.finishTime = finish

                    console.log(report, 'after finish', 4347643634374);

                    return report.save()
                })
                .then(report => {
                    // 3. sum of diffTime of each session
                    const itemsDiffTime = []
                    report.workingSessions.forEach(session => {
                        console.log(session, 'session', 123);
                        console.log(session.diffTime, 'session.diffTime', 123);
                        itemsDiffTime.push(+session.diffTime)
                    })

                    console.log(itemsDiffTime, 'itemsDiffTime', 124786);
                    itemsDiffTime.forEach(item => {
                        console.log(item, ' item', 123);
                        // console.log(typeof report.totalWorkingTime, 'report.totalWorkingTime', 123);
                        return report.totalWorkingTime = (+report.totalWorkingTime + +item).toFixed(2)
                    })

                    console.log(itemsDiffTime, 'itemsDiffTime after add item');

                    // // backup
                    // let sum = 0
                    // const total = itemsDiffTime.forEach(item => {
                    //     return sum += +item
                    // })
                    // report.totalWorkingTime = total
                    return report.save()

                })
                .then(report => {
                    // console.log(report, 'block then 2');

                    report.overTime = +report.totalWorkingTime > 8 ? (+report.totalWorkingTime - 8).toFixed(2) : 0

                    // console.log(report, 'after tt wT');

                    report.totalSummaryTime = (+report.totalWorkingTime + +report.dayLeaveHours.period).toFixed(2)
                    console.log(report.totalSummaryTime, 'report.totalSummaryTime');

                    // console.log(report, 'after tt sum T');

                    report.underTime = +report.totalSummaryTime < 8 ? (8 - +report.totalSummaryTime).toFixed(2) : 0

                    // console.log(report, 'after tt uT');

                    return report.save()
                })
                .then(report => {
                    // loop through all reports & get the whole result
                    // later : ensure that is each month

                    // console.log(report, 'block then 3');

                    return Report.find({ userId: req.user._id })
                        .then(reports => {
                            // console.log(report, 'wuigfiwygfi');
                            // console.log(reports, 'reports');
                            let sumOverTime = 0
                            let sumUnderTime = 0
                            reports.map(report => {
                                sumOverTime += +report.overTime
                                sumUnderTime += +report.underTime
                            })
                            // console.log(sumOverTime, 'sumOverTime');
                            // console.log(sumUnderTime, 'sumUnderTime');
                            report.salary = +(3000000 + ((+sumOverTime - +sumUnderTime) / 8) * 200000).toFixed(0)

                            report.workMode = false
                            console.log(report, 'after update salary');

                            return report.save()
                                .then(report => {
                                    console.log(report, 88888888);
                                    req.user.updateUserReport(report)
                                })
                        })

                })

            // const rp = reports[0]
            // if (reports.date.toLocaleDateString() !== now.toLocaleDateString()) return next(new Error('over day'))

            // // first time checkout or not -> still have to update all remaining
            // // bc once checkin -> have the data

            // rp.workingSessions[0].checkout = finish
            // rp.workingSessions[0].diffTime = finish - rp.workingSessions[0].checkin

            // rp.finishTime = finish

            // // 3. sum of diffTime of each session
            // const itemsDiffTime = []
            // reports.workingSessions.forEach(session => {
            //     itemsDiffTime.push(session.diffTime)
            // })
            // itemsDiffTime.forEach(item => {
            //     return rp.totalWorkingTime += +item
            // })
            // // // backup
            // // let sum = 0
            // // const total = itemsDiffTime.forEach(item => {
            // //     return sum += +item
            // // })
            // // rp.totalWorkingTime = total

            // rp.workMode = false
            // return reports.save()
        })
        // .then(reports => {
        //     const rp = reports[0]

        //     rp.overTime = rp.totalWorkingTime > 8 ? rp.totalWorkingTime - 8 : 0

        //     rp.totalSummaryTime = rp.totalWorkingTime + rp.dayLeaveHours

        //     rp.underTime = rp.totalSummaryTime < 8 ? 8 - rp.totalSummaryTime : 0

        //     return reports.save()
        // })
        // .then(rp => {
        //     // loop through all reports & get the whole result
        //     // later : ensure that is each month

        //     Report.find({ userId: req.user._id })
        //         .then(reports => {
        //             let sumOverTime
        //             let sumUnderTime
        //             reports.map(report => {
        //                 sumOverTime += report.overTime
        //                 sumUnderTime += report.underTime
        //             })
        //             rp[0].salary = +(3000000 + ((+sumOverTime - +sumUnderTime) / 8) * 200000).toFixed(0)

        //             return rp.save()
        //         })

        // })
        .then(() => res.redirect('/attendance'))
        .catch(err => next(err))
}


// get & request daily rp 

exports.postSelectedMonth = (req, res, next) => {
    const month = req.body.month

    Report.find({ userId: req.user._id })
        .then(reports => {
            const rpOfSelectedMonth = reports.filter(report => +report.date.split('-')[1] === +month)
            return rpOfSelectedMonth // get all rp of this selected month
        })
        .then(rpOfSelectedMonth => {
            req.session.rpOfSelectedMonth = rpOfSelectedMonth

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

exports.getReportDetails = (req, res, next) => {
    const rpOfSelectedMonth = req.session.rpOfSelectedMonth

    const userId = req.params.userId || req.user._id

    const ReportsPerPage = +req.session.pagination || 1
    const page = +req.query.page || 1
    let totalReports

    Report.find({ userId: userId })
        .countDocuments()
        .then(countReports => {
            totalReports = countReports
            return Report.find({ userId: userId })
                .skip((page - 1) * ReportsPerPage)
                .limit(ReportsPerPage)
        })
        .then(reports => {
            return res.render('employee/report-details', {
                title: 'report',
                path: '/report-details',
                reports: reports,
                hasNextPage: ReportsPerPage * page < totalReports,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                currentPage: page,
                lastPage: Math.ceil(totalReports / ReportsPerPage),
                rpOfSelectedMonth: rpOfSelectedMonth
            });
        })
        .catch(err => next(err))
}



exports.postRegisterLeave = (req, res, next) => {
    const reason = req.body.reason;
    const dayRegister = req.body.dayRegister
    const hourRegister = req.body.hourRegister
    const userId = req.user._id

    console.log(reason, 'reason');
    console.log(dayRegister, 'dayRegister');
    console.log(hourRegister, 'hourRegister');
    console.log(userId, 'userId');

    // 1. add leave hour for dayReport
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
        // 2. update aL
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
            console.log(user.image, 'user.image 1');
            user.image ? deleteFile.deleteFile(user.image) : null
            return user.save();
        })
        .then(user => {
            console.log(imgFile, 'imgFile');
            user.image = imgFile.path
            console.log(user.image, 'user.image 2');
            return user.save();
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
};

exports.getProfile = (req, res, next) => {
    User.findById(req.user._id)
        .then(user => {
            console.log(user);
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

    const userId = req.user._id
    console.log(userId, 'userId');
    console.log(temperature, 'temperature');
    console.log(injectionType2, 'injectionType2');

    User.findById(userId)
        .then(user => {
            console.log(user, 'user bf');
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
            console.log(user, 'user at');
            return user.save()
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
};

exports.getHealthDeclaration = (req, res, next) => {
    console.log(req.user);
    User.find()
        .where('_id').ne('627c644af847400f53e77fe0')
        .then(users => {
            res.render('employee/health-declaration', {
                title: 'health-declaration',
                path: '/health-declaration',
                users: users
            });
        })
        .catch(err => next(err))
}