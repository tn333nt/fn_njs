exports.getProduct = (req, res) => { 
    res.render('add-product', { 
        pageTitle : 'add product', 
        path : '/admin/add-product'
    })
}

const products = []

exports.postProduct = (req, res) => { 
    products.push({ title : req.body.title })
    res.redirect('/') 
} 

exports.getShop = (req, res) => {
    res.render('shop', { 
        products : products, 
        pageTitle : 'shop', 
        path : '/'
    })
}