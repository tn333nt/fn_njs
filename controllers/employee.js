
const User = require('../models/user');
const Report = require('../models/report');
const deleteFile = require('../middleware/deleteFile')


// get & check attendance

exports.getAttendance = (req, res, next) => {
    req.user
        .populate('reports.reportId')
        .execPopulate()
        .then(user => {
            // get each rp stored in each rpId obj
            const reports = user.reports.map(report => {
                return { report: { ...report.reportId.toObject() } }
            });
            return res.render('employee/attendance', {
                title: 'attendance',
                path: '/attendance',
                user: user,
                reports: reports
            })
        })
        .catch(err => next(err))
}

var refTime
exports.postCheckIn = (req, res, next) => {
    /**
     * 1. always add new ws & startSession
     * 2. update startTime : neu do la lan checkin dtien thi add, else ignore
     * 3. change workMode -> T
     * 4. rmb convert it into (decimal) num (both sT & fT)
     */

    Report.find({ date: new Date().getDate() })
        .then(report => {
            if (!startTime) {
                const report = new Report({
                    userId: req.user._id,
                    date: new Date().toUTCString(),
                    startTime: new Date().getTime()
                })
                return report.save();
            }
            else {

            }

        })
        .then(() => res.redirect('/attendance'))
        .catch(err => next(err))
}

exports.postCheckOut = (req, res, next) => {
    /**
     * 0. find doc that has workMode = T (vi mac dinh la F => will found tk pending)
     * 1. find lan checkin chua co finishSession trc -> add
     * 2. neu chua co finishTime (& related others ) -> add, else cap nhat
     *  ( tinh theo ngay )
     * 8. chain theo block, thay cx on ma=)
     * 3. totalWorkingTime = diff fT & sT
     * 4. overTime = diff total & 8 (day) -> cho thang = 
     * 5. totalSummaryTime = sum tt & fetched aL
     * 7. underTime = 8 - totalSummaryTime (later : uT positive || 0)
     * (theo thang => phai tu lap qua xong cong don may cai tren vao )
     * 6. salary = 3000000 + (monthly : overTime - underTime)*200000 
     */

    Report.find({ startTime: new Date().getDate() })
        .then(report => { })
        .then(() => res.redirect('/attendance'))
        .catch(err => next(err))
}


// get & request detailed info of report 

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

// emp -> lap daily rp
// mng -> lap daily rp of every emp 
// tuc 1 tk la find all rp con 1 tk la find rp cua dua tren userId 
// chac phai tach rieng ra r:D

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
        .execPopulate()
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
    const image = req.file;

    if (!image) {
        return res.status(422).render('employee/profile', {
            title: 'profile',
            path: '/profile',
            errMsg: 'check the file'
        });
    }

    req.user
        .then(user => {
            if (image) {
                deleteFile(user.image)
                user.image = 'images/' + image.filename
            }
            return user.save();
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
};

exports.getProfile = (req, res, next) => {
    req.user
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

    req.user
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
    const managerId = req.user.managerId
    req.user
        .then(user => {
            User.findById(managerId)
                .then(manager => {
                    let isManager
                    return isManager = manager ? true : false
                })
            return res.render('employee/health-declaration', {
                title: 'health-declaration',
                path: '/health-declaration',
                user: user,
                isManager: isManager
            });
        })
        .catch(err => next(err))
}