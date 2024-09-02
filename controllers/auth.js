const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  let errMssg = req.flash('error');
  errMssg.length? errMssg = errMssg[0] : errMssg = null ; 

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: errMssg
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
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
          req.flash('error', "Password is incorrect");
          return res.redirect('/login');
        }
      })
      .catch(err =>{
        console.log(err);
        res.redirect('/login');
      });
    } else {
      req.flash('error', "Email doesn't exist");
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

exports.getReset = (req, res, next)=>{
  let errMssg = req.flash('error');
  errMssg.length? errMssg = errMssg[0] : errMssg = null ; 
  
  res.render('auth/reset', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: errMssg
  });
};
