const mongoose = require('mongoose');
const Order = require('./order');
const product = require('./product');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }]
  }
});

userSchema.methods.addToCart = function (prodId) {

  let updatedCartItems = [...this.cart.items];
  const productCartIndex = this.cart.items.findIndex((cp) => {
    return cp.productId == prodId;
  });
  if (productCartIndex >= 0) {
    updatedCartItems[productCartIndex].quantity++;

  } else {
    updatedCartItems.push({ 
      productId: prodId, 
      quantity: 1 })
  }
  const updatedCart = { items: updatedCartItems }
  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.getCart = function () {
  // user.cart = { items:[{productId: ObjectId(id), qunatity: 2}] }
  const newCart = { ...this.cart };
  return this.populate('cart.items.productId').then((products) => {
    return products.cart.items.map((item) => { 
      item.productId.quantity = item.quantity
      return item.productId })
  })

}

userSchema.methods.deleteItemFromCart = function (prodId) {
  const cart = { ...this.cart };
  const updatedCartItems = cart.items.filter((cartItem) => { return cartItem.productId.toString() !== prodId.toString() });
  cart.items = updatedCartItems
  this.cart = cart;
  return this.save();
}

userSchema.methods.addOrder = function(){
      return this.getCart().then((products)=>{
        console.log(this._id);
        const productsSnapShot = products.map((item)=>{ return {
          title: item.title,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          userId: item.userId,
          quantity: item.quantity,
        } })
        const order = new Order({
          items: productsSnapShot,
          user: {
            userId : this._id,
            name: this.name
          }
        });
        return order.save();
      })
      .then((result) => {
        this.cart = {items : []};
        this.save();
      })
}

module.exports = mongoose.model('User', userSchema);


//   addOrder(){
//    
//   }

//   getOrders(){
//     const db = getDb();
//     return db
//     .collection('orders')
//     .find({'user._id': this._id})
//     .toArray()
//   }


