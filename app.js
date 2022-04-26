const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database')
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res) => {
    User.findByPk(1)
    .then( user => {
        console.log(user);
        req.user = user // add new field to req obj with assigned value is a sequelize obj => can use utility methods
        next()
    }) // store data in a req
}) // register cb as mw for icm req

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, {
    // constraints: true,
    onDelete: 'CASCADE'
})
User.hasMany(Product)

sequelize
    // .sync({ force: true })
    .sync()
    .then( () => User.findByPk(1) )
    .then( user => user ? user : User.create({
        name: 'abc',
        email: 'abc@example.com'
    })) // or return or Promise.resolve()
    .then(() => app.listen(3000))