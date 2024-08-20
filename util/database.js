const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect('mongodb+srv://ibrahim:r9GQE1Isy4v3wXuC@cluster0.moqb1.mongodb.net/shop?retryWrites=true&w=majority&appName=cluster0')
  .then((result) => {
    _db = result.db()
    cb();
  })
  .catch((err) => {
     console.log(err); 
     throw err;
  });
}

const getDb = ()=>{
  if(_db){
    return _db;
  }
  throw 'No database found';
}
exports.mongoConnect = mongoConnect
exports.getDb = getDb;
