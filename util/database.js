const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoConnect = callback => {
    MongoClient
        .connect('mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        .then(client => {
            callback(client)
        })
        .catch(err => {
            console.log(err);
        }) 
}

module.exports = mongoConnect
