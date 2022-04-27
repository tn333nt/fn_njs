const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database')
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next();
        })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User)
User.hasMany(Product)
Order.belongsTo(User)
User.hasMany(Order)
User.hasOne(Cart)
Cart.belongsToMany(Product, { through : CartItem }) 
Order.belongsToMany(Product, { through : OrderItem }) 

sequelize
    // .sync({ force: true })
    .sync()
    .then(() => User.findByPk(1))
    .then(user => user ? user : User.create({
        name: 'abc',
        email: 'abc@example.com'
    }))
    .then( user => user.createCart())
    .then(() => app.listen(3000))
