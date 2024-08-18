const path = require('path');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM products').then(result=>{ console.log(result); }).catch(err=>{console.log(err);});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findByPk(1)
        .then((user)=>{
            req.user = user;
            next();
        })
        .catch((err)=>{console.log(err);})
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

Product.belongsToMany(Cart, {through : CartItem});
Cart.belongsToMany(Product, { through: CartItem });

User.hasOne(Cart);


sequelize.sync(
    // {force: true}
)
    .then(() => {
       return User.findAll()})
    .then((users) => {
        if (users.length === 0) {
            return User.create({ username: 'Ibrahim', email: 'ibrahim@gmail.com' });
        } else {
            return users[0];
        }
    })
    .then((user)=>{
        return user.createCart();
    })
    .then((result)=>{
        app.listen(3000);
    })
    .catch((err) => { console.log(err); })


