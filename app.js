const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// const Product = require('./models/product');
const User = require('./models/user');
// const Order = require('./models/order');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('626bc0b18a517f76ef639f1d')
        .then(user => {
            req.user = user 
            next();
        })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
.connect('mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/newShop?retryWrites=true&w=majority')
.then(() => {
    User.findOne()
    .then(user => {
        if(!user) {
            const user = new User({
                name : 'abc',
                email : 'abc@example.com',
                cart : { items : [] }
            })
            user.save()
        }
    })
    app.listen(3000)
})
