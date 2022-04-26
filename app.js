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

app.use((req, res, next) => {
    User.findByPk(1)
    .then( user => {
        console.log(user);
        req.user = user 
        next();
    }) 
}) 

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
}) 

sequelize
    // .sync({ force: true })
    .sync()
    .then( () => User.findByPk(1) )
    .then( user => user ? user : User.create({
        name: 'abc',
        email: 'abc@example.com'
    })) 
    .then(() => app.listen(3000))



/** kw 'special methods' in doc
 * https://sequelize.org/docs/v6/core-concepts/assocs/
 * gained by instances (current states) of those Ms 
 * -> interact with associated M (when the relation is defined)
 * e.x
    - A.belongsTo(B)
    ---> 
    aInstance.getB()
    aInstance.setB()
    aInstance.createB()
    
    (?) so these methods is like pass data from A to B by A() then revert
    or just 1d?
    or pass into some associated places ?
    */