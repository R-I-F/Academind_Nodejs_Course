const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('66cafd28e5cea265beba62c1')
  .then((user)=>{
    req.user = user;
    next();
  })
  .catch((err)=>{ console.log(err); });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
.connect(process.env.DRIVER_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {
  User.findOne()
  .then((user) => {
    if(!user){
      const user = new User({name: 'Ibrahim', email: 'ibrahim@gmail.com', cart:{items:[]}});
      return user.save();
    }
    return user;
  })
  
})
.then(result => app.listen(3000))
.catch((err) => { console.log(err); });



