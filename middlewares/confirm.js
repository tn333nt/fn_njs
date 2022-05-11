
exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login') 
    }
    next()
}

exports.isManager = (req, res, next) => {
    if (req.user._id) {
        req.session.isManager = true 
        return next()
    }
    res.redirect('/report-details')
}