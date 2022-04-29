const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db; 

const mongoConnect = callback => {
    MongoClient
        .connect('mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            _db = client.db('shop') 
            callback()
        })
}

const getDb = () => {
    if (_db) {
        return _db 
    }
}
exports.mongoConnect = mongoConnect 
exports.getDb = getDb 


