const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// const Product = require('./models/product');
// const User = require('./models/user');
// const Order = require('./models/order');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findByPk('626b3817c89e1988610f6aeb')
//         .then(user => {
//             console.log('user cart', user.cart);
//             user ? req.user = new User(user.name, user.email, user.cart, user._id) : null
//             console.log('ascvs', req.user);
//             next();
//         })
// })

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
app.use(errorController.get404);

mongoose
.connect('mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/shop?retryWrites=true&w=majority')
.then(() => app.listen(1111))
