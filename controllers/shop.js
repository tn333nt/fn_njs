const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
      // console.log('from product details', product.title);
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      // console.log(products) 
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
};

exports.getCart = (req, res, next) => {
  // console.log('from cart', res.user); // =))))))
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
    })
    .then(cartProducts => {
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
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: id } })
    })
    .then(products => {
      console.log('products', products);
      if (products[0]) {
        const oldQuantity = products[0].cartItem.quantity
        newQuantity = oldQuantity + 1
        return products[0]
      }
      return Product.findByPk(id)
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      })
    })
    .then(() => res.redirect('/cart'))
}

// (1)
exports.deleteCart = (req, res) => {
  const id = req.body.productId;
  req.user.getCart()
    .then(cart => {
      // return cart.removeProduct({where: {id: id }}) // co remove ma nhi ? https://sequelize.org/docs/v6/core-concepts/assocs/#foobelongstomanybar--through-baz-
      return cart.getProducts({ where: { id: id } })
    })
    .then(products => {
      return products[0].cartItem.destroy()
    })
    .then(() => res.redirect('/cart'))
}


exports.getOrders = (req, res, next) => {
  console.log('from order', res.user);
  // console.log(res.user.getOrders);
  req.user.getOrders({
    include: ['products'] 
    // include products per order when fetch all the orders
  })
  .then( orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders : orders
    })
  })
};

exports.postOrder = (req, res, next) => {
  let fetchedProducts
  let fetchedCart
  let fetchedOrder
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      fetchedProducts = products
      return req.user.createOrder()
    }) 
    .then(order => {
      fetchedOrder = order
      return order.addProducts(fetchedProducts.map(product => {
        product.orderItem = { quantity : product.cartItem.quantity} 
        return product
      }))
    }) 
    // (2)
    .then(products => {
      console.log('products', products)
      // // let itemQuantity
      const itemQuantity = []
      products.forEach(product => {
        // // itemQuantity += product.dataValues.quantity
        itemQuantity.push(product.dataValues.quantity)
      })
      const quantity = itemQuantity.reduce((a, b) => a + b, 0)
      // let sum = 0
      // const quantity = itemQuantity.forEach(q => sum += q)
      return quantity
    }) // sao 2 cach deu ko dc :D
    .then( () => {
      fetchedCart.setProducts(null)
      // fetchedCart.destroy()
    })
    .then(() => res.redirect('/orders'));
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};



/* 
Failed to load resource: the server responded with a status of 500 (Internal Server Error)

=))))))))
res.user =)))

tuong gi cu undefined ca dong =)
*/

// order product