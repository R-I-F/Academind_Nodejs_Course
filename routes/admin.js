const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { check, body } = require('express-validator');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, [
    check('title')
        .isLength({max: 30})
        .custom((value, {req})=>{
            if(value.trim().length === 0){
                throw new Error('Title must contain something');
            }
            return true;
        }),
    check('price')
        .isFloat(),
    check('description')
        .custom((value, { req })=>{
            if(value.trim().length <= 3){
                throw new Error('Description must be more than 3 characters');
            }
            return true;
        })
], adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
