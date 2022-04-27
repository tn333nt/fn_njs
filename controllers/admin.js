const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts() 
    .then(products => {
      // console.log(products);
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
  req.user
    .createProduct({ 
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
    })
    .then(products => {
      // console.log(products);
      res.redirect('/admin/products')
    })
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
      // console.log(updatedProduct);
      res.redirect('/admin/products')
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  const id = req.params.productId
  if (!editMode) {
    return res.redirect('/')
  }
    req.user
      .getProducts({
        where: { id: id }
      })
    .then(products => {
      res.render('admin/add-product', {
        pageTitle: 'edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: products[0]
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
      // console.log(deleteProduct);
      res.redirect('/admin/products')
    })
}
