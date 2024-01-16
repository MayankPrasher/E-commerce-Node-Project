const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const router = express.Router();

const products = [];
router.get('/add-product',(req, res, next)=>{
    // console.log("profile running");
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('add-product',{pageTitle:'Add Product'});
});
// app.use('/user',(req, res, next)=>{
//     // console.log("profile running");
//     console.log(req.body);
//     res.redirect("/");
// });
router.post('/add-product',(req, res, next)=>{
    // console.log("profile running");
    products.push({title:req.body.title});
    res.redirect("/");
});
exports.routes=router;   
exports.products=products;