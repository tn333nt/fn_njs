const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    });
};

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
  const product = new Product({
    title : title,
    imageUrl : imageUrl,
    price : price,
    description : description
  }) 
  product.save()
    .then(() => res.redirect('/admin/products'))
} 

exports.postEditProduct = (req, res) => {
  const id = req.body.productId
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description

  Product.findByIdAndUpdate(id, { 
    title : updatedTitle,
    imageUrl : updatedImageUrl,
    price : updatedPrice,
    description : updatedDescription
  })
  .then(() => res.redirect('/admin/products'))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  const id = req.params.productId
  if (!editMode) {
    return res.redirect('/')
  }
  Product.findById(id)
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
  Product.findByIdAndDelete(id)
    .then(() => res.redirect('/admin/products'))
}
