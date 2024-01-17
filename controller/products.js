const Product = require('../models/product');
exports.getAddproduct = (req, res, next)=>{
    res.render('add-product',{
        pageTitle:'Add Product',
        path:'/admin/add-product'
        });
};
exports.postAddproduct=(req, res, next)=>{
    // console.log("profile running");
    const product = new Product(req.body.title);
    product.save();
    res.redirect("/"); 
};
exports.getProducts=(req, res, next)=>{
 Product.fetchAll((products)=>{
    res.render('shop',{
        products:products,
        pageTitle:'Shop',
        path:'/'
    });
 });
    
};