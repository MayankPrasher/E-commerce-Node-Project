const express = require('express');
const router = express.Router();
const productController = require('../controller/products');

router.get('/add-product',productController.getAddproduct);
router.post('/add-product',productController.postAddproduct);

module.exports = router;