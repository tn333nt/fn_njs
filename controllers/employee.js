const mongoose = require('mongoose');

const User = require('../models/user');
const Report = require('../models/report');
const deleteFile = require('../middlewares/deleteFile')


// get & check attendance

exports.getAttendance = (req, res, next) => {
    console.log(123, req.user);
    console.log(1423523, req.user.reports.report);
    req.user
        .populate('reports.report.reportId')
        .then(user => {
            console.log(user.reports.report, 'user.reports.report haajka');
            const report = user.reports.report.find(report => {
                // sao no lay co cai rp dau tien thoi thi phai ?
                // checkin thi tao ra 1 rp moi vs date today r ma nhi ?
                // temp get day only
                // const rpDay = report.reportId.date.toUTCString().split(' 2022 ')[0].split(' ')[1] 
                // const today = new Date().toUTCString().split(' 2022 ')[0].split(' ')[1]-1 // =))))
                const rpDay = report.reportId.date
                const today = new Date().toISOString().split('T')[0] 
                console.log(rpDay, 'rpDay');
                console.log(today, 'today');
                return rpDay.toString() === today.toString()
            })
            console.log('report from page after post checkin' + report) // sao hqua vua chay dc hn da undefined r?=))
            // console.log(report.reportId, 'report from page after post checkin123abc')
            res.render('employee/attendance', {
                title: 'attendance',
                path: '/attendance',
                user: user,
                report: report?.reportId
            })
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

    const today = now.toISOString().split('T')[0].toString()
    

    return Report.find({ userId: req.user._id })
        .then(reports => {
            console.log(reports);
            // find if there is today's report
            const updatedReports = reports.filter(report => {
                console.log('...', report.startTime);
                console.log('---', report.date);
                const rpDay = report.date
                const today = new Date().toISOString().split('T')[0]
                console.log(rpDay, 'rpDay');
                console.log(today, 'today');
                return rpDay === today
            }) // to let it return arr

            console.log(updatedReports);

            if (updatedReports.length <= 0) {
                const rp = new Report({ 
                    date: today, 
                    startTime: start, 
                    userId: req.user._id, 
                    workplaces: [{ workplace: workplace }],
                    workingSessions: [{
                        checkin: start,
                        workplace: workplace,
                    }],
                    workMode: true
                })
                console.log(rp, 'rp');
                return rp.save()
            } else {
            return Report.findOne({ 
                _id: reports[0]._id,
                date: today
             })
             .then(report => {
                console.log(report, 'report 1');

                if (report.startTime === 0) {
                    report.startTime = start
                    report.date = now
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
                
            })
        }


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
    const now = new Date()

    const time = `${now.getHours()}-${now.getMinutes()}`
    console.log(time, 'time');
    const timeArr = time.split('-');
    console.log(timeArr, 'timeArr');

    const finish = (+timeArr[0] + +timeArr[1] / 60).toFixed(2)
    console.log(finish, 'finish');


    return Report.findOne({
        userId: req.user._id,
        workMode: true
    })
        .then(reports => {
            console.log(reports, 'reports');
            return Report.findOne({ 
                _id: reports._id,
                date: now.toISOString().split('T')[0].toString()
             })
                .then(report => {
                    // console.log(report, 'report');

                    // const rp = reports[0]
                    if (report.date !== now.toISOString().split('T')[0].toString()) return next(new Error('over day'))

                    // first time checkout or not -> still have to update all remaining
                    // bc once checkin -> have the data

                    report.workingSessions.at(-1).checkout = finish
                    report.workingSessions.at(-1).diffTime = finish - +report.workingSessions.at(-1).checkin

                    report.finishTime = finish

                    console.log(report, 'after finish', 4347643634374);

                    report.workMode = false
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
                        console.log( item, ' item', 123);
                        // console.log(typeof report.totalWorkingTime, 'report.totalWorkingTime', 123);
                        return report.totalWorkingTime += +item
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

                    report.overTime = +report.totalWorkingTime > 8 ? +report.totalWorkingTime - 8 : 0

                    // console.log(report, 'after tt wT');

                    report.totalSummaryTime = +report.totalWorkingTime + +report.dayLeaveHours.period

                    // console.log(report, 'after tt sum T');

                    report.underTime = +report.totalSummaryTime < 8 ? 8 - +report.totalSummaryTime : 0

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

                            console.log(report, 'after update salary');

                            return report.save()
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
    console.log(req.params.userId, 2476120906)
    const userId = req.params.userId ? req.params.userId : req.user._id
    const ReportsPerPage = +req.body.pagination || 1
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
                lastPage: Math.ceil(totalReports / ReportsPerPage)
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
            console.log(user);
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