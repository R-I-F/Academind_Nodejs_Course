const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
  .then((user) => {
    if(user){
      bcrypt.compare(password, user.password)
      .then((doMatch)=>{
        if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            console.log(err);
            return res.redirect('/');
          });
        }
        else {
          return res.redirect('/login');
        }
      })
      .catch(err =>{
        console.log(err);
        res.redirect('/login');
      });
    } else {
      return res.redirect('/login');
    }
  })
  .catch(err =>{
    console.log(err);
    res.redirect('/login');
  });

};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
  .then((userDoc) => {
    if(userDoc){
      return res.redirect("/signup");
    } else {
      bcrypt.hash(password, 12)
      .then((hashPass)=>{
        const newUser = new User({
          email: email, 
          password: hashPass,
          cart: { items: [] }
        });
        return newUser.save()
      })
      .then((result)=>{
      res.redirect('/login');
    })
  }})
  .catch((err) => { console.log(err); });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
