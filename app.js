const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const errorController = require('./controllers/error');
// const Product = require('./models/product');
const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const mongoConnect = require('./util/database').mongoConnect

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk('626a8db4a4275922b032d062')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id)
            next();
        })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
// app.use(errorController.get404);

mongoConnect(() => app.listen(3000))
