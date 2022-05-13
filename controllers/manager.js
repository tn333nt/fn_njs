const fs = require('fs');
const path = require('path');

const pdfDocConstructor = require('pdfkit')
const mongoose = require('mongoose');

const User = require('../models/user');
const Report = require('../models/report');


exports.getAllReports = (req, res, next) => {
    // console.log(122131);
    console.log(req.user._id);
    User.find()
        .populate('reports.report.reportId')
        .then(users => {
            console.log(users, 'users');
            const employees = users.filter(user => {
                return user.email !== '123@gmail.com'
            })
            const reports = employees.map(emp => {
                console.log(emp.reports.report, 2143);
                return emp.reports.report
            })
            // console.log(reports, 'reports');
            console.log(employees, 'employees');
            res.render('manager/work-reports', {
                title: 'reports',
                path: '/reports',
                reports: reports,
                employees: employees
            });
        })
        .catch(err => next(err))
}

// exports.postReportDetails = (req, res, next) => {
//     const employeeId = req.body.employeeId
//     Report.findById(employeeId)
//     .then(() => res.redirect(`/reports/${employeeId}`))
//     .catch(err => next(err))
// }


// delete data from previous days
exports.deleteOldReports = (req, res, next) => {
    const now = new Date().toISOString().split('T')[0].toString();

    Report.deleteMany({ date: { $ne: now}, userId: {$ne: mongoose.Types.ObjectId('627c644af847400f53e77fe0')}})
    .then(() => res.redirect('back'))

    // Report.find(
    //     {
    //         userId: {
    //             $ne: mongoose.Types.ObjectId('627c644af847400f53e77fe0')
    //         }
    //     }
    // )
    //     .then(reports => {
    //         console.log(reports, 111);
    //         if (!reports) return next(new Error('no found Report'))
    //         // update new reports with only data of today
    //         const updatedReports = reports.filter(report => {
    //             const rpDay = report.date.toString() 
    //             const today = now.toISOString().split('T')[0].toString()
    //             console.log(rpDay, 'rpDay');
    //             console.log(today, 'today');
    //             return rpDay !== today
    //         });
    //         console.log(updatedReports, 222);
    //         // reports = updatedReports;
    //         // console.log(reports, 'reports bf then');
    //         // return reports.save();

    //         // later : delete() with config date lt today
    //     })
    //     .then((reports) => {
    //         console.log(reports, 'reports at then');
    //         res.redirect('back')
    //     })
    //     .catch(err => next(err))

};

// toggle actions check in-out & register leave
exports.postDisableChanges = (req, res, next) => {
    Report.find(
        {
            userId: {
                $ne: mongoose.Types.ObjectId('627c644af847400f53e77fe0')
            }
        }
    )
        .then(reports => {
            console.log(reports, 3732638619);
            // reports.forEach(report => {
            //     report.editMode = !report.editMode
            // })
            // return reports.save()

            return reports.forEach(report => {
                return Report.findById(report._id)
                    .then(rp => {
                        rp.editMode = !rp.editMode
                        return rp.save()
                    })
                    .catch(err => next(err))
            })

            // ra la chi dc save for only one

            // return Report.find().then(reports => {
            //     reports.map(report => {
            //         report.editMode = !report.editMode
            //         return report.editMode
            //     })
            //     return reports.save()
            // })
        })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
}

// get health-declaration as pdf doc
exports.getDeclaration = (req, res, next) => {
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
