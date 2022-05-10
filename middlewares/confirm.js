const { ObjectId } = require("bson")

exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login') 
    }
    next()
}

exports.isManager = (req, res, next) => {
    if (req.user._id.toString() === ObjectId('626ebc84126f7a0bcce75a20').toString()) {
        req.session.isManager = true 
        return next()
    }
    res.redirect('/report-details')
}