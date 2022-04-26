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
  Product.create({ // immediately save new created values to db
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  }).then( data => {
    console.log(data);
  })
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

exports.postEditProduct = (req, res) => {
  const id = req.body.productId
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageUrl
  const updatedDescription = req.body.description
  const updatedPrice = req.body.price
  const updatedProduct = new Product( 
    id,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDescription
  )
  updatedProduct.save()
  res.redirect('/admin/products')
}

exports.editProduct = (req, res, next) => {
  const editMode = req.query.edit
  const id = req.params.productId
  console.log(id)
  if (!editMode) {
    return res.redirect('/')
  }
  Product.findById(id, product => {
    console.log(product);
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