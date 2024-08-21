const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');


class User {
  constructor(username, email){
    this.username = uername;
    this.email = email;
  };

  save(){
    const db = getDb();
    return db.collection('users')
    .insertOne(this)
    .then((result)=>{console.log(result);})
    .catch((err)=>{console.log(err);})
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
