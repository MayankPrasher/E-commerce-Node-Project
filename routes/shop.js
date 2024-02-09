const express = require('express');
const path = require('path');
const IsAuth = require('../middleware/isAuth');

const router = express.Router();
const shopController = require('../controller/shop')

router.get('/',shopController.getIndex);
router.get('/products',IsAuth,shopController.getProducts);
router.get('/products/:productId',IsAuth,shopController.getProduct);
router.get('/cart',IsAuth,shopController.getCart);
router.post('/cart',shopController.postCart);
router.post('/deleteCartproduct',shopController.postdeleteCartproduct);
// // router.get('/checkout',shopController.getCheckout);
router.get('/orders',IsAuth,shopController.getOrders);
router.post('/orders',shopController.postOrders);
router.get('/orders/:orderId',IsAuth,shopController.getInvoice);

module.exports=router;