const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const mongoConnect = require('./util/database').mongoConnect;
const getDb = require('./util/database').getDb;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('66c5cc8d89f026ce9ca567d7')
  .then((user)=>{
    req.user = new User(user.username, user.email, user.cart, user._id);
    next();
  })
  .catch((err)=>{ console.log(err); });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(()=>{
  app.listen(3000);
})


