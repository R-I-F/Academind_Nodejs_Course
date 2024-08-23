const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');


class User {
  constructor(username, email, cart, id){
    this.username = username;
    this.email = email;
    this.cart = cart
    this._id = id ;
  };

  save(){
    const db = getDb();
    return db.collection('users')
    .insertOne(this)
    .then((result)=>{console.log(result);})
    .catch((err)=>{console.log(err);})
  }

  addToCart(prodId){
    const db = getDb();
    let newQuantitiy = 1;
    let updatedCartItems = [...this.cart.items];
    const productCartIndex = this.cart.items.findIndex((cp)=>{
      return cp.productId == prodId;
    });
    if(productCartIndex >= 0){
      updatedCartItems[productCartIndex].quantity ++;
      
    } else {
      updatedCartItems.push({productId: new ObjectId(prodId), quantity: 1})
    }
    const updatedCart = {items:updatedCartItems}
    return db.collection('users')
    .updateOne({_id: this._id}, {$set: { cart: updatedCart }})
  }

  static findById(userId){
    const db = getDb();
    return db.collection('users')
    .findOne({_id: new ObjectId(userId)})
    .then((result)=>{
      return result
    })
    .catch((err)=>{ console.log(err); })    
  };

}

module.exports = User;
