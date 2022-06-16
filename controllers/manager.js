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
            console.log(employees,'employees');
            const reports = employees.map(employee => employee.reports.report)
            res.render('manager/work-reports', {
                title: 'reports',
                path: '/reports',
                reports: reports,
                employees: employees
            });
        })
        .catch(err => next(err))
}

// delete data from previous days
exports.deleteOldReports = (req, res, next) => {
    const now = new Date().toISOString().split('T')[0].toString();
    const managerId = mongoose.Types.ObjectId('627c644af847400f53e77fe0')

    Report.deleteMany({
        date: { $ne: now },
        userId: { $ne: managerId }
    })
        .then(() => res.redirect('back'))
};

exports.postToggleChanges = (req, res, next) => {
    const managerId = mongoose.Types.ObjectId('627c644af847400f53e77fe0')

    Report.find({ userId: { $ne: managerId } })
        .then(reports => {
            return reports.forEach(report => {
                return Report.findById(report._id)
                    .then(rp => {
                        rp.editMode = !rp.editMode
                        return rp.save()
                    })
                    .catch(err => next(err))
            })
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
}

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
