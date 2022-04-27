const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const errorController = require('./controllers/error');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const mongoConnect = require('./util/database')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findByPk(1)
//         .then(user => {
//             req.user = user
//             next();
//         })
// })

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use(errorController.get404);

mongoConnect( client => {
    console.log(client);
    app.listen(3000)
})

/* 
MongoServerSelectionError: connect ETIMEDOUT 16.162.114.38:27017
reason: TopologyDescription {
    type: 'ReplicaSetNoPrimary',
    servers: Map(3) {
      'cluster0-shard-00-02.ti4jx.mongodb.net:27017' => [ServerDescription],
      'cluster0-shard-00-00.ti4jx.mongodb.net:27017' => [ServerDescription],
      'cluster0-shard-00-01.ti4jx.mongodb.net:27017' => [ServerDescription]
    },
    stale: false,
    compatible: true,
    heartbeatFrequencyMS: 10000,
    localThresholdMS: 15,
    setName: 'atlas-rztqr4-shard-0',
    logicalSessionTimeoutMinutes: undefined
  },
  code: undefined,
  [Symbol(errorLabels)]: Set(0) {}
}

ok=)) vpn =)
*/