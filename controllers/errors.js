
exports.get404 = (req,res) => {
    const url = req.url
    res.status(404).render('404', { 
        pageTitle : 404, 
        path : url 
    })
} 

