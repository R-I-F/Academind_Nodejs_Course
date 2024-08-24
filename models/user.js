// const getDb = require('../util/database').getDb;
// const { ObjectId } = require('mongodb');


// class User {
//   constructor(username, email, cart, id){
//     this.username = username;
//     this.email = email;
//     this.cart = cart
//     this._id = id ;
//   };

//   save(){
//     const db = getDb();
//     return db.collection('users')
//     .insertOne(this)
//     .then((result)=>{console.log(result);})
//     .catch((err)=>{console.log(err);})
//   }

//   addToCart(prodId){
//     const db = getDb();
//     let newQuantitiy = 1;
//     let updatedCartItems = [...this.cart.items];
//     const productCartIndex = this.cart.items.findIndex((cp)=>{
//       return cp.productId == prodId;
//     });
//     if(productCartIndex >= 0){
//       updatedCartItems[productCartIndex].quantity ++;
      
//     } else {
//       updatedCartItems.push({productId: new ObjectId(prodId), quantity: 1})
//     }
//     const updatedCart = {items:updatedCartItems}
//     return db.collection('users')
//     .updateOne({_id: this._id}, {$set: { cart: updatedCart }})
//   }

//   getCart(){
//     // user.cart = {items:[{productId: ObjectId(id), qunatity: 2}]}
//     const db = getDb();
//     const newCart = {...this.cart};
//     const productIds = newCart.items.map((cartItem)=>{
//       return cartItem.productId;
//     });
//     return db.collection('products').find({_id: { $in: productIds }}).toArray()
//     .then((products)=>{
//       return products.map((product)=>{
//         return {...product, 
//           quantity: newCart.items.find((cartItem)=>{ 
//             return cartItem.productId.toString() === product._id.toString() 
//           }).quantity
//         }
//       })
//     })
//   }

//   addOrder(){
//     const db = getDb();
//     return this.getCart().then((products)=>{
//       const order = {
//         items: products,
//         user: {
//           _id : this._id,
//           name: this.username
//         }
//       };
//       return db
//       .collection('orders').insertOne(order);
//     })
//     .then((result) => { 
//       this.cart = {items : []};
//       return db.collection('users').updateOne({ _id: this._id }, {$set: { cart: { items: [] } }});
//     })
//   }

//   getOrders(){
//     const db = getDb();
//     return db
//     .collection('orders')
//     .find({'user._id': this._id})
//     .toArray()
//   }

//   deleteItemFromCart(prodId){
//     const db = getDb();
//     const cart = {...this.cart};
//     const updatedCartItems = cart.items.filter((cartItem)=>{ return cartItem.productId.toString() != prodId });
//     console.log(this.id);
//     cart.items = updatedCartItems
//     return db.collection('users').updateOne({_id : this._id},{$set:{cart: cart}});
//   }

//   static findById(userId){
//     const db = getDb();
//     return db.collection('users')
//     .findOne({_id: new ObjectId(userId)})
//     .then((result)=>{
//       return result
//     })
//     .catch((err)=>{ console.log(err); })    
//   };

// }

// module.exports = User;
