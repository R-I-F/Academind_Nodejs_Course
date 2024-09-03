const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
require('dotenv').config();

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY 
})

const sentFrom = new Sender("ibrahim@trial-ynrw7gyj5xjg2k8e.mlsender.net", "Ibrahim");


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
          const recipients = [ new Recipient(email, "Sir/Madam") ];
          const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject('Account created')
            .setText('Congratulations, You have just created a new account on academind node js shop.')
          mailerSend.email.send(emailParams)
            .then((result)=>{ console.log('mail sent'); }).catch((err) => { console.log(err); });
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

exports.postReset = (req, res, next)=>{
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer)=>{
    if(err){
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: email})
      .then((user)=>{
        if(!user){
          req.flash('error','No user found');
          return res.redirect('/reset');
        }
        const recipients = [ new Recipient(email, "Sir/Madam") ];
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject('Account created')
            .setHtml(`Please click the following link to reset the password: <a href='http://localhost:3000/reset/${token}'>Reset Password</a>`)
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          user.save()
            .then((result)=>{
              mailerSend.email.send(emailParams)
                .then((result)=>{ 
                  console.log('Mail sent');
                })
                .catch((err) => { console.log(err); });
                return res.redirect('/reset');
            })
      })
  });
};
