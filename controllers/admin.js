const { validationResult } = require('express-validator/check')

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasErr: false, 
    errMsg: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;
  console.log(imageUrl)

  if (!imageUrl) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      product: {
        title: title,
        price: price,
        description: description
      },
      editing: false,
      hasErr: true,
      errMsg: 'check the file',
      validationErrors: []
    });
  }
  // bc if iU =udf -> err in path la dr=)

  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl.path,
    description: description,
    userId: req.user
  });
  const errors = validationResult(req)
  
  

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      product: product,
      editing: false,
      hasErr: true,
      errMsg: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch(e => {
      const err = new Error(e)
      err.httpStatusCode = 500
      next(err) 
    })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        product: product,
        editing: editMode,
        hasErr: false,
        errMsg: null,
        validationErrors: []
      });
    })
    .catch(e => {
      const err = new Error(e) 
      err.httpStatusCode = 500
      next(err) 
    })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.file;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const product = {
    title: updatedTitle,
    price: updatedPrice,
    description: updatedDesc,
    _id: prodId
  };
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      product: product,
      editing: true,
      hasErr: true,
      errMsg: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      updatedImageUrl ? product.imageUrl = updatedImageUrl.path : null
      return product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch(e => {
      const err = new Error(e) 
      err.httpStatusCode = 500
      next(err) 
    })
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(e => {
      const err = new Error(e) 
      err.httpStatusCode = 500
      next(err) 
    })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => res.redirect('/admin/products'))
    .catch(e => {
      const err = new Error(e) 
      err.httpStatusCode = 500
      next(err) 
    })
};
