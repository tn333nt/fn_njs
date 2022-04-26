const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({ 
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  }).then( products => {
    console.log(products);
  })
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then( products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.postEditProduct = (req, res) => {
  const id = req.body.productId
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description
  Product.findByPk(id)
  .then( product => {
    product.title = updatedTitle,
    product.imageUrl = updatedImageUrl,
    product.price = updatedPrice,
    product.description = updatedDescription
    return product.save() // provided () -> save back to db
  })
  .then( updatedProduct => {
    console.log(updatedProduct);
    res.redirect('/admin/products')
  })
}

exports.editProduct = (req, res, next) => {
  const editMode = req.query.edit
  const id = req.params.productId
  if (!editMode) {
    return res.redirect('/')
  }
  Product.findByPk(id)
  .then( product => {
    res.render('admin/add-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      editing : editMode,
      product: product
    });
  })
};

exports.postDeleteProduct = (req, res) => {
  const id = req.body.productId
  Product.deleteById(id)
  res.redirect('/admin/products')
}