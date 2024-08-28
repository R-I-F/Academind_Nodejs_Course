const User = require('../models/user');
exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isLoggedIn: req.session.isLoggedIn
      });
};

exports.postLogin = (req, res, next) => {
    User.findById('66cda5ccccd88d30fde4f7bf')
    .then(user => {
        req.session.user = user;
        req.session.isLoggedIn = true;   
        res.redirect('/');
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next)=>{
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    });
}
