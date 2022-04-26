const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then( products => {
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
  .then( product => {
    console.log(product.title);
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    })
  } )
}

exports.getIndex = (req, res, next) => {
  Product.findAll() 
  .then( products => {
    console.log(products) 
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
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
    Product.fetchAll()
    .then( ([records, fieldData]) => {
      const cartProducts = []
      records.forEach(rec => {
        const cartProduct = cart.records.find(p => p.id === rec.id)
        if (cartProduct) {
          cartProducts.push({
            product: rec,
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
