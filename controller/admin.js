const Product = require('../models/product');
exports.getAddproduct = (req, res, next)=>{
    res.render('admin/add-product',{
        pageTitle:'Add Product',
        path:'/admin/add-product'
        });
};
exports.postAddproduct=(req, res, next)=>{
    // console.log("profile running");
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const desc = req.body.desc;
    const price = req.body.price;
    const product = new Product(title,imageUrl,desc,price);
    product.save();
    res.redirect("/"); 
};
exports.getProducts = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/products',{
            products:products,
            pageTitle:'All products',
            path:'/admin/products'
        });
     });  
}