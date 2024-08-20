const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (cb) => {
  MongoClient.connect('mongodb+srv://ibrahim:r9GQE1Isy4v3wXuC@cluster0.moqb1.mongodb.net/?retryWrites=true&w=majority&appName=cluster0')
  .then((result) => {
     cb(result); 
  })
  .catch((err) => {
     console.log(err); 
  });
}
module.exports = mongoConnect;