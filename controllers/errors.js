
exports.get404 = (req,res) => {
    const url = req.url
    res.status(404).render('404', { 
        pageTitle : 404, 
        path : url 
    })
} 



// why ? why it doesn't set to be 'unactive' but 'undefined' ?,
// -- vi no chua co ca "path" de ma check luon va ejs co ve ko choi doan "path &&" inside =))

