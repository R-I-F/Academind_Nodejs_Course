const express = require('express');
const User = require('../models/user');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email', 'Please make sure the Email is written in a correct format')
        .isEmail()
        .normalizeEmail(), 
    body('password', 'Please make sure the password has a minimum of 5 characters and is alphanumeric')
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),
], authController.postLogin);

router.post('/signup', 
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid E-mail')
            .custom((value, {req})=>{
                return User.findOne({ email: value })
                .then(userDoc => {
                  if (userDoc) {
                    return Promise.reject('Email already exists, please pick a different Email');
                  }
                })
            })
            .normalizeEmail(),  
        body('password', 'the password has to be at least 5 characters and alphanumeric characters')
            .isLength({min: 5})
            .trim()   
            .isAlphanumeric(),
        check('confirmPassword')
            .trim()
            .custom((value, {req})=>{
                if(value !== req.body.password){
                    throw new Error('Please make sure to confirm the password correctly');
                }
                return true;
            }),
    ], 
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
