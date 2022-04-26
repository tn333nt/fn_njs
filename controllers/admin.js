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
  req.user
    .createProduct({ // create Product for User?
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
      // userId: req.user.id
    })
    .then(products => {
      console.log(products);
      res.redirect('/admin/products')
    })
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
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
    .then(product => {
      product.title = updatedTitle,
        product.imageUrl = updatedImageUrl,
        product.price = updatedPrice,
        product.description = updatedDescription
      return product.save()
    })
    .then(updatedProduct => {
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
    .then(product => {
      res.render('admin/add-product', {
        pageTitle: 'edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
};

exports.postDeleteProduct = (req, res) => {
  const id = req.body.productId
  Product.findByPk(id)
    .then(product => {
      return product.destroy()
    })
    .then(deleteProduct => {
      console.log(deleteProduct);
      res.redirect('/admin/products')
    })
}