const fs = require('fs');
const path = require('path');

const pdfDocConstructor = require('pdfkit')

const User = require('../models/user');
const Report = require('../models/report');


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

// disable actions check in-out & register leave
exports.postDisableChanges = (req, res, next) => {
    const reportId = req.params.reportId
    Report.findById(reportId)
        .then(report => {
            report.editMode = false
            return report.save()
        })
        .catch(err => next(err))
}

// get health-declaration as pdf doc
exports.getDeclaration = (req, res, next) => {
    User.find(
        {
            _id: {
                $ne: ObjectId('62723fec666ebe0b98236cd5') // mngId later
            }
        }
        // {
        //     $not: {
        //         _id: 
        //     }
        // } // or
    )
        // where('_id').ne('62723fec666ebe0b98236cd5') // or
        .exec((err, data) => {
            if (err) next(err);
            return data
        })
        .then(users => {
            if (!users) return next(new Error('no user'))

            const declaration = userId + '.pdf'
            const declarationPath = path.join('data', 'declarations', declaration)
            const pdfDoc = new pdfDocConstructor()
            res.writeHeader(200, {
                'content-type': 'application/pdf',
                'content-disposition': 'inline'
            })
            pdfDoc.pipe(fs.createWriteStream(declarationPath))
            pdfDoc.pipe(res)

            pdfDoc.fontSize(33).text('health-declaration', { underline: true })
            users.user.forEach(user => {
                pdfDoc.fontSize(18).text(`
                timeRegister: ${user.health.timeRegister},
                temperature: ${user.health.temperature} (celsius),
                ...
                isPositive: ${user.health.isPositive}
                `)
            })

            pdfDoc.end()
        })
        .catch(err => next(err))
}
