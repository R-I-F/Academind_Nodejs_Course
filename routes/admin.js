const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', adminController.getEditProduct);
// http://localhost:3000/admin/edit-product/123456?edit=true

// /admin/edit-product => POST
router.post('/edit-product/:productId', adminController.postEditProduct);
// http://localhost:3000/admin/edit-product/123456

// /admin/delete-product => DELETE
router.post('/delete-product/:productId', adminController.deleteProduct);
// http://localhost:3000/admin/edit-product/123456

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

module.exports = router;
