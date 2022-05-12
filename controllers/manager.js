const fs = require('fs');
const path = require('path');

const pdfDocConstructor = require('pdfkit')
const mongoose = require('mongoose');

const User = require('../models/user');
const Report = require('../models/report');


exports.getAllReports = (req, res, next) => {
    req.user
        .populate('reports.reportId')
        .then(user => {
            const reports = user.reports
            res.render('manager/work-reports', {
                title: 'reports',
                path: '/reports',
                reports: reports
            });
        })
        .catch(err => next(err))
}


exports.getReportDetails = (req, res, next) => {
    const ReportsPerPage = +req.body.pagination || 1
    const page = +req.query.page || 1
    let totalReports

    Report.find()
        .countDocuments()
        .then(countReports => {
            totalReports = countReports
            return Report.find()
                .skip((page - 1) * ReportsPerPage)
                .limit(ReportsPerPage)
        })
        .then(reports => {
            return res.render('manager/report-details', {
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


exports.postNumberOfReport = (req, res, next) => {
    // find 
}

// delete data from previous days
exports.deleteOldReports = (req, res, next) => {
    const now = new Date();
    Report.find()
        .then(reports => {
            if (!reports) return next(new Error('no found Report'))
            // update new reports with only data of now
            const updatedReports = reports.find(report => {
                return report.date === now;
            });
            reports = updatedReports;
            return reports.save();

            // later : delete() with config date lt today
        })
        .then(() => res.redirect('/reports/:reportId'))
        .catch(err => next(err))
};

// toggle actions check in-out & register leave
exports.postDisableChanges = (req, res, next) => {
    const reportId = req.params.reportId
    Report.findById(reportId)
        .then(report => {
            report.editMode = !report.editMode
            return report.save()
        })
        .catch(err => next(err))
}

// get health-declaration as pdf doc
exports.getDeclaration = (req, res, next) => {
    const userId = req.user._id
    User.find(
        {
            _id: {
                $ne: mongoose.Types.ObjectId('627c644af847400f53e77fe0')
            }
        }
    )
        .then(users => {
            console.log(users);
            if (!users) return next(new Error('no user'))

            const declaration = 'emp-health-declaration.pdf'
            const declarationPath = path.join('data', declaration)
            const pdfDoc = new pdfDocConstructor()

            // console.log(pdfDoc, 1);

            res.writeHeader(200, {
                'content-type': 'application/pdf',
                'content-disposition': 'inline'
            })
            pdfDoc.pipe(fs.createWriteStream(declarationPath))
            pdfDoc.pipe(res)

            // console.log(pdfDoc, 2);

            pdfDoc.fontSize(33).text('health-declaration', { underline: true })
            users.forEach(user => {
                pdfDoc.fontSize(18).text(`
                timeRegister: ${user.email},
                timeRegister: ${user.health.timeRegister},
                temperature: ${user.health.temperature} (celsius),
                ...
                isPositive: ${user.health.isPositive}
                `)
            })

            // console.log(pdfDoc, 3);

            pdfDoc.end()
        })
        .catch(err => next(err))
}
