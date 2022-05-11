var mongoose = require('mongoose');

exports.confirmAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login') 
    }
    next()
}

exports.confirmManager = (req, res, next) => {
    if (!req.session.isManager) {
        return res.redirect('/report-details')
    }
    next()
}
