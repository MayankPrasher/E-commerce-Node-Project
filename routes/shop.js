const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');
const router = express.Router();

router.get('/',(req, res, next)=>{
    // console.log("in the another middleware!!!");
    // console.log(adminData.products);
    // res.sendFile(path.join(rootDir,'views','shop.html'));
    const products = adminData.products;
    res.render('shop',{products:products,docTitle:'Shop'});
});

module.exports=router;