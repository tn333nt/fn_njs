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
      const file = fs.createReadStream(invoicePath) // -> read file step by step in diff chunks
      res.setHeader('content-type', 'application/pdf')
      res.setHeader('Content-Disposition', 'inline')
      file.pipe(res) // forward chunks to the browser to concatenate into 1 obj

    })
    .catch(err => next(err))
}


/*
bc reading file data into memory to serve it as a res -> take time & can be overflow in mmr // preloading data

stream
https://nodesource.com/blog/understanding-streams-in-nodejs/
https://nodejs.dev/learn/nodejs-streams

pipe()
https://nodejs.org/en/knowledge/advanced/streams/how-to-use-stream-pipe/

stream ~ continuous transmission of data/files from a server to a client (s)

data is streamed chunk by chunk
buffers -> access to these chunks
file.pipe(res) -> turn the file s (readable s)'s output into the res (writable s)
-> keep streaming res to the browser
-> browser concat these icm data pieces into the final file 

=> node only need to streams all the data to the client on the fly & store 1 chunk of data
but not pre-load all into mmr

// streaming data
*/