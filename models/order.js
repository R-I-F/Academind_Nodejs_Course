const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items:[{
        title:{
            type: String,
            required: true
          },
          price:{
            type: Number,
            required: true
          },
          description:{
            type: String,
            required: true
          },
          imageUrl:{
            type: String,
            required: true
          },
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          quantity:{
            type: Number,
            required: true,
          }
    }], 
    user: {
        userId: { 
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true,
            ref: 'User'
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);
    
    // const order = {
    //         items: products,
    //         user: {
    //           _id : this._id,
    //           name: this.username
    //         }