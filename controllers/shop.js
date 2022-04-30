const Product = require('../models/product');
const Order = require('../models/order');

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
    Product.findById(id.trim())
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
}


exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
}

exports.postCart = (req, res) => {
    const id = req.body.productId
    Product.findById(id)
        .then(product => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
}

exports.deleteCartItem = (req, res) => {
  const id = req.body.productId;
  req.user.deleteFromCart(id)
    .then(() => res.redirect('/cart'))
}


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

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        console.log( user.cart.items);
        const products = user.cart.items.map(item => { 
            return {
                quantity : item.quantity,
                product : { ...item.productId._doc } // access* all data in pI obj
            }
        })
        console.log(req.user, 'ab');
        const order = new Order({
            products : products,
            user : {
                name : req.user.name,
                userId : req.user // auto get id (only, if not config)
            }
        })
        return order.save()
    })
    .then(() => res.redirect('/orders'));
}

// // exports.getCheckout = (req, res, next) => {
// //   res.render('shop/checkout', {
// //     path: '/checkout',
// //     pageTitle: 'Checkout'
// //   });
// // };
