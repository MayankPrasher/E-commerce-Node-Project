const express = require('express');
const {body,check} = require('express-validator');
const router = express.Router();
const adminController = require('../controller/admin');
const IsAuth = require('../middleware/isAuth');

router.get('/add-product',IsAuth,adminController.getAddproduct);

router.get('/products',IsAuth,adminController.getProducts);

router.post('/add-product',[
    body('title')
    .isString()
    .isLength({min:3})
    .trim(),
    body('price')
    .isFloat(),
    body('desc')
    .isLength({min:5 , max:400})
    .trim()
],IsAuth,adminController.postAddproduct);

router.get('/edit-products/:productId',IsAuth,adminController.getEditproduct);

router.post('/edit-products',[
    body('title')
    .isString()
    .isLength({min:3})
    .trim(),
    // body('imageUrl')
    // .isURL(),
    body('price')
    .isFloat(),
    body('desc')
    .isLength({min:5 , max:400})
    .trim()
],IsAuth,adminController.postEditproduct);

router.delete('/product/:productId',IsAuth,adminController.deleteproduct);

module.exports = router;