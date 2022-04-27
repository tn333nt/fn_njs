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

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then( cart => {
    return cart.getProducts() 
  })
  .then( cartProducts => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts
    });
  })
}

exports.postCart = (req, res) => {
  const id = req.body.id
  let fetchedCart 
  let newQuantity = 1
  req.user
  .getCart()
  .then( cart => {
    fetchedCart = cart
    return cart.getProducts({where: {id: id}})
  })
  .then( products => {
    console.log('products', products);
    if (products[0]) {
      const oldQuantity = products[0].cartItem.quantity 
      newQuantity = oldQuantity + 1
      return products[0]
    }
    return Product.findByPk(id)
  })
  .then( product => { 
    return fetchedCart.addProduct(product, {
      through: { quantity: newQuantity } 
    })
  })
  .then( () => res.redirect('/cart') )
}

exports.deleteCart = (req, res) => {
  const id = req.body.productId;
  req.user.getCart()
  .then( cart => {
    // return cart.removeProduct({where: {id: id }}) // what is the problem when removing product with this id directly from cart
    return cart.getProducts({where: {id: id}})
  })
  .then( products => {
    return products[0].cartItem.destroy()
  })
  .then( () => res.redirect('/cart'))
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
