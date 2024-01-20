const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');

router.get('/add-product',adminController.getAddproduct);

router.get('/products',adminController.getProducts);

router.post('/add-product',adminController.postAddproduct);

router.get('/edit-products/:productId',adminController.getEditproduct);

router.post('/edit-products',adminController.postEditproduct);

router.post('/delete-product',adminController.postDeleteproduct);

module.exports = router;