const { validationResult } = require('express-validator/check')

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasErr: false, // keep old data
    errMsg: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render('admin/edit-product', {
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
    .catch(err => {
      console.log(err);
    });
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
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const product = {
    title: updatedTitle,
    imageUrl: updatedImageUrl,
    price: updatedPrice,
    description: updatedDesc,
    _id: prodId
  };
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render('admin/edit-product', {
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
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

/** CastError: Cast to ObjectId failed for value "" (type string) at path "_id" for model "Product"  
  messageFormat: undefined,
  stringValue: '""',
  kind: 'ObjectId',
  value: '',
  path: '_id',
  reason: Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters 
  valueType: 'string'
*/

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};
