const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const IsAuth = require('../middleware/isAuth');

router.get('/add-product',IsAuth,adminController.getAddproduct);

router.get('/products',IsAuth,adminController.getProducts);

router.post('/add-product',adminController.postAddproduct);

router.get('/edit-products/:productId',IsAuth,adminController.getEditproduct);

router.post('/edit-products',IsAuth,adminController.postEditproduct);

router.post('/delete-product',IsAuth,adminController.postDeleteproduct);

module.exports = router;