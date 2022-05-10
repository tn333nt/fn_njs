
const User = require('../models/user');
const Report = require('../models/report');
const deleteFile = require('../middleware/deleteFile')


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

exports.getReportDetails = (req, res, next) => {
    const managerId = req.user.managerId
    const reportId = req.params.reportId;
    const ReportsPerPage = +req.body.pagination || 1
    const page = +req.query.page || 1
    let totalReports

    Report.findById(reportId)
        .then(report => {
            if (!report) {
                return res.redirect('back');
            }
            return Report.find()
                .countDocuments()
                .then(countReports => {
                    totalReports = countReports
                    return Report.find()
                        .skip((page - 1) * ReportsPerPage)
                        .limit(ReportsPerPage)
                })
                .then(reports => {
                    return User.findById(managerId).then(user => {
                        const isManager = user ? true : false
                        return res.render('employee/report-details', {
                            title: 'report',
                            path: '/report-details',
                            report: report,
                            reports: reports,
                            isManager: isManager,
                            hasNextPage: ReportsPerPage * page < totalReports,
                            hasPreviousPage: page > 1,
                            nextPage: page + 1,
                            previousPage: page - 1,
                            currentPage: page,
                            lastPage: Math.ceil(totalReports / ReportsPerPage)
                        });
                    })
                })

        })
        .catch(err => next(err))
}

exports.registerLeave = (req, res, next) => {
    const reportId = req.params.reportId
    const period = req.body.period;
    const reason = req.body.reason;
    const appliedDate = new Date();

    req.user
        .populate('reports.reportId')
        .execPopulate()
        .then(user => {
            // 1. add leave hour for dayReport
            const reports = user.reports.map(report => {
                // return { report: { ...report.reportId._doc } }; // https://stackoverflow.com/a/60978177
                return { report: { ...report.reportId.toObject() } } // https://stackoverflow.com/a/66944141
            });
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
    const userId = req.user._id
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