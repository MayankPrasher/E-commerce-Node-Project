const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');

router.get('/add-product',adminController.getAddproduct);

router.get('/products',adminController.getProducts);

router.post('/add-product',adminController.postAddproduct);

module.exports = router;