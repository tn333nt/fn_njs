const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
};

exports.getProducts = (req, res, next) => {
    Product.find() // get an ARR of data instead of cursor
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
};

// exports.getProduct = (req, res) => {
//   const id = req.params.productId
//   Product.findByPk(id)
//     .then(product => {
//       res.render('shop/product-detail', {
//         product: product,
//         pageTitle: product.title,
//         path: '/products'
//       })
//     })
// }


// exports.getCart = (req, res, next) => {
//   req.user.getCart()
//     .then(products => {
//       res.render('shop/cart', {
//         path: '/cart',
//         pageTitle: 'Your Cart',
//         products: products
//       });
//     })
// }

// exports.postCart = (req, res) => {
//   const id = req.body.productId
//   console.log('postCart', id);
//   Product.findByPk(id)
//   .then(product => {
//     console.log('...', req.user);
//     return req.user.addToCart(product)
//   })
//   .then(() => res.redirect('/cart'))
// }

// exports.deleteCartItem = (req, res) => {
//   const id = req.body.productId;
//   req.user.deleteFromCart(id)
//     .then(() => res.redirect('/cart'))
// }


// exports.getOrders = (req, res, next) => {
//   console.log('from order', res.user);
//   req.user.getOrders()
//   .then( orders => {
//     res.render('shop/orders', {
//       path: '/orders',
//       pageTitle: 'Your Orders',
//       orders : orders
//     })
//   })
// };

// exports.postOrder = (req, res, next) => {
//   req.user.addOrder()
//     .then(() => res.redirect('/orders'));
// }

// // exports.getCheckout = (req, res, next) => {
// //   res.render('shop/checkout', {
// //     path: '/checkout',
// //     pageTitle: 'Checkout'
// //   });
// // };
