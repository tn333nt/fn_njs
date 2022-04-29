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
    Product.find() 
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
};

exports.getProduct = (req, res) => {
  const id = req.params.productId
  Product.findById(id.trim()) // auto convert str into objID() // but not auto trim() =))
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
}

/*
CastError: Cast to ObjectId failed for value " 626ba69f9fc8246f636644c5" (type string) at path "_id" for model "Product"
stringValue: '" 626ba69f9fc8246f636644c5"',
  kind: 'ObjectId',
  value: ' 626ba69f9fc8246f636644c5',
  path: '_id',
  reason: BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or 
an integer
*/


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
