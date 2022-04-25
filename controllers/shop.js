const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res) => {
  const id = req.params.productId;
  console.log(id);
  Product.findById(id, product => res.render('shop/product-detail', {
    product: product,
    pageTitle: product.title,
    path: '/products'
  }))
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.postCart = (req, res) => {
  const id = req.body.id
  Product.findById(id, product => {
    Cart.addProduct(id, product.price)
  })
  res.redirect('/cart')
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = []
      products.forEach(product => {
        const cartProduct = cart.products.find(p => p.id === product.id)
        if (cartProduct) {
          cartProducts.push({
            product: product,
            quantity: cartProduct.quantity
          })
        }
      })
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    })
  })
}

exports.deleteCart = (req, res) => {
  const id = req.body.productId;
  console.log(id);
  Product.findById(id, product => {
    Cart.deleteProduct(id, product.price)
    res.redirect('/cart')
  })
} 


exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
