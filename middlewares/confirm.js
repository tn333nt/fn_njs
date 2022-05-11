var mongoose = require('mongoose');

exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login') 
    }
    next()
}

exports.isManager = (req, res, next) => {
    if (req.user._id.toString() === mongoose.Types.ObjectId('627b988970f0856aa5afec3e').toString()) {
        req.session.isManager = true 
        return next()
    }
    res.redirect('/report-details')
}