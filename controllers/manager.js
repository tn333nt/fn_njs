const fs = require('fs');
const path = require('path');

const pdfDocConstructor = require('pdfkit')
const mongoose = require('mongoose');

const User = require('../models/user');
const Report = require('../models/report');


exports.getAllReports = (req, res, next) => {
    const managerEmail = '123@gmail.com'

    User.find()
        .populate('reports.report.reportId')
        .then(users => {
            const employees = users.filter(user => {
                return user.email !== managerEmail
            })

            res.render('manager/work-reports', {
                title: 'reports',
                path: '/reports',
                employees: employees
            });
        })
        .catch(err => next(err))
}

// delete data from previous days
exports.deleteOldReports = (req, res, next) => {
    const now = new Date().toISOString().split('T')[0].toString();
    const userId = req.params.userId

    Report.deleteMany({
        date: { $ne: now },
        userId: userId
    })
        .then(() => res.redirect('back'))
};

// change editMode of rp -> of user
exports.postToggleChanges = (req, res, next) => {
    const userId = req.params.userId

    User.findById(userId)
        .then(user => {
            user.editMode = !user.editMode
            return user.save()
                .catch(err => next(err))
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
}


exports.getReportDetails = (req, res, next) => {
    const userId = req.params.userId
    
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
                path: '/reports',
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

//
exports.getPdfDeclaration = (req, res, next) => {
    const managerId = mongoose.Types.ObjectId('627c644af847400f53e77fe0')

    User.find({ _id: { $ne: managerId } })
        .then(users => {
            if (!users) return next(new Error('no user'))

            const declaration = 'emp-health-declaration.pdf'
            const declarationPath = path.join('data', declaration)
            const pdfDoc = new pdfDocConstructor()

            res.writeHeader(200, {
                'content-type': 'application/pdf',
                'content-disposition': 'inline'
            })
            pdfDoc.pipe(fs.createWriteStream(declarationPath))
            pdfDoc.pipe(res)

            pdfDoc.fontSize(33).text('health-declaration', { underline: true })
            users.forEach(user => {
                pdfDoc.fontSize(18).text(`
                employee's email : ${user.email},
                timeRegister : ${user.health.timeRegister},
                temperature : ${user.health.temperature} (celsius),
                vaccination :
                    - turn 1 : ${user.health.vaccination.turn1.type1} in ${user.health.vaccination.turn1.date1}
                    - turn 2 : ${user.health.vaccination.turn2.type2} in ${user.health.vaccination.turn2.date2}
                be positive : ${user.health.isPositive}
                `)
            })

            pdfDoc.end()
        })
        .catch(err => next(err))
}
