const fs = require('fs');
const path = require('path');

const pdfDocConstructor = require('pdfkit')

const Product = require('../models/product');
const Order = require('../models/order');

const productsPerPage = 1

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1
  let totalProducts

  Product.find()
  .count() // https://stackoverflow.com/a/65286914 // https://stackoverflow.com/a/62539985
  .then(numProducts => {
    totalProducts = numProducts
    return Product.find()
    .skip((page-1)*productsPerPage)
    .limit(productsPerPage)
  })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        totalProducts: totalProducts,
        currentPage: page,
        hasNextPage: productsPerPage*page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts/productsPerPage)
      });
    })
    .catch(err => next(err))
};

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
    .catch(err => next(err))
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
    .catch(err => next(err))
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
    .catch(err => next(err))
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => res.redirect('/cart'))
    .catch(err => next(err))
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
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => next(err))
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
    .catch(err => next(err))
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId)
    .then(order => {
      if (!order) return next(new Error('no found O'))
      if (order.user.userId.toString() !== req.user._id.toString()) return next(new Error('unauthorised'))

      const invoice = orderId + '.pdf'
      const invoicePath = path.join('data', 'invoices', invoice)
      const pdfDoc = new pdfDocConstructor()
      res.writeHeader(200, {
        'content-type': 'application/pdf',
        'content-disposition': 'inline'
      })
      pdfDoc.pipe(fs.createWriteStream(invoicePath))
      pdfDoc.pipe(res)
    
      pdfDoc.fontSize(33).text('invoice', {underline: true}) 
      order.products.forEach(p => {
        pdfDoc.fontSize(18).text(`
         product ${p.product.title} : ${p.quantity} * ${p.product.price}
         total : ${p.quantity * p.product.price}`)
      })

      pdfDoc.end()
    })
    .catch(err => next(err))
}
