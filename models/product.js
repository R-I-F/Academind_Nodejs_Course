const getDb = require('../util/database').getDb;
const {ObjectId} = require('mongodb');

class Product{
  constructor(title, price, description, imageUrl, id){
    this.title = title,
    this.price = price,
    this.description = description,
    this.imageUrl = imageUrl,
    this._id = id ? new ObjectId(id) : null ;
  }

  save(){
    const db = getDb();
    let dbOps;
    
    if(this._id){
      dbOps = db.collection('products')
      .updateOne({ _id: this._id }, { $set: this })
    } 
    else {
      dbOps = db.collection('products')
      .insertOne(this)
        
    }
    return dbOps
    .then((result)=>{
      console.log(result);})
    .catch((err)=>{console.log(err);})
  }

  static fetchAll(){
    const db = getDb();
    return db.collection('products')
      .find()
      .toArray()
  }

  static findById(prodId){
    const db = getDb();
    return db.collection('products')
      .find({ _id: new ObjectId(prodId)})
      .next()
      .then((result)=>{
        return result;
      })
      .catch((err)=>{console.log(err);})
  }

}

module.exports = Product ;