const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db; // use internally

const mongoConnect = callback => {
    MongoClient
        .connect('mongodb+srv://test:bJYVI29LEAjl147U@cluster0.ti4jx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
        .then(client => {
            _db = client.db() // connect to 'myFirstDatabase' by default or create it as soon as we start writing data on it 
            callback(client)
        })
}

const getDb = () => {
    if (_db) {
        return _db // return access if the db is set
    }
}
exports.mongoConnect = mongoConnect // connect to db
exports.getDb = getDb // store connection to the db


