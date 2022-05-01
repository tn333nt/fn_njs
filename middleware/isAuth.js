module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login') // 2. combine general mw
    }
    next()
}