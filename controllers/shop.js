const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(e => {
      const err = new Error(e)
      err.httpStatusCode = 500
      next(err)
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(e => {
      const err = new Error(e)
      err.httpStatusCode = 500
      next(err)
    })
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(req.csrfToken())
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(e => {
      const err = new Error(e)
      err.httpStatusCode = 500
      next(err)
    })
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(e => {
      const err = new Error(e)
      err.httpStatusCode = 500
      next(err)
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(e => {
      const err = new Error(e)
      err.httpStatusCode = 500
      next(err)
    })
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(e => {
      const err = new Error(e)
      err.httpStatusCode = 500
      next(err)
    })
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(e => {
      const err = new Error(e)
      err.httpStatusCode = 500
      next(err)
    })
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId)
    .then(order => {
      if (!order) return next(new Error('no found O'))
      if (order.user.userId.toString() !== req.user._id.toString()) return next(new Error('unauthorised'))

      const invoicePath = path.join('data', 'invoices', 'abc.pdf')
      fs.readFile(invoicePath, (err, data) => {
        if (err) return next(err)
        res.setHeader('content-type', 'application/pdf')
        res.setHeader('Content-Disposition', 'inline')
        res.send(data)
      })

    })
    .catch(err => next(err))
}