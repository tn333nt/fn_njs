const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.editProduct = (req, res, next) => {
  // check if the action is for editing or adding
  const editMode = req.query.edit
  console.log(editMode);
  console.log(req.query);
  if (!editMode) {
    res.redirect('/')
    // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  }
  res.render('admin/add-product', {
    pageTitle: 'edit Product',
    path: '/admin/edit-product',
    editing : editMode
  });
};
