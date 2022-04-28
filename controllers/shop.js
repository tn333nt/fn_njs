const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.findByPk(id)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => { 
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
}

exports.postCart = (req, res) => {
  const id = req.body.id
  Product.findByPk(id)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(() => res.redirect('/cart'))
}

// exports.deleteCart = (req, res) => {
//   const id = req.body.productId;
//   req.user.getCart()
//     .then(cart => {
//       return cart.getProducts({ where: { id: id } })
//     })
//     .then(products => {
//       return products[0].cartItem.destroy()
//     })
//     .then(() => res.redirect('/cart'))
// }


// exports.getOrders = (req, res, next) => {
//   console.log('from order', res.user);
//   req.user.getOrders({
//     include: ['products'] 
//   })
//   .then( orders => {
//     res.render('shop/orders', {
//       path: '/orders',
//       pageTitle: 'Your Orders',
//       orders : orders
//     })
//   })
// };

// exports.postOrder = (req, res, next) => {
//   let fetchedProducts
//   let fetchedCart
//   req.user.getCart()
//     .then(cart => {
//       fetchedCart = cart
//       return cart.getProducts()
//     })
//     .then(products => {
//       fetchedProducts = products
//       return req.user.createOrder()
//     }) 
//     .then(order => {
//       return order.addProducts(fetchedProducts.map(product => {
//         product.orderItem = { quantity : product.cartItem.quantity} 
//         return product
//       }))
//     }) 
//     .then(() => res.redirect('/orders'));
// }

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
