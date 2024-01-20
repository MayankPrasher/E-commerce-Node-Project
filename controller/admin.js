const Product = require('../models/product');

exports.getAddproduct = (req, res, next)=>{
    res.render('admin/edit-products',{
        pageTitle:'Add Product',
        path:'/admin/add-product',
        editing:false
        });
};
exports.postAddproduct=(req, res, next)=>{
    // console.log("profile running");
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const desc = req.body.desc;
    const price = req.body.price;
    const product = new Product(null,title,imageUrl,desc,price);
    product.save();
    res.redirect("/"); 
};
exports.getEditproduct = (req, res, next)=>{
    const edit = req.query.edit;
    console.log(edit);
        if(!edit){
            return res.redirect('/');
        }
        const productId = req.params.productId;
        Product.findbyId(productId,product=>{
            if(!product){
                return res.redirect("/");
            }
            res.render('admin/edit-products',{
                pageTitle:'Edit product',
                path:'/admin/edit-products',
                editing : edit,
                product:product
            })
        })
        
};
exports.postEditproduct=(req,res,next)=>{
    const productId = req.body.id;
    const updatedtitle = req.body.title;
    const updatedimgUrl = req.body.imageUrl;
    const updateddesc = req.body.desc;
    const updatedprice = req.body.price;
    const updatedProduct = new Product(
        productId,
        updatedtitle,
        updatedimgUrl,
        updateddesc,
        updatedprice,
    );
    updatedProduct.save();
    res.redirect('/admin/products');
}
exports.postDeleteproduct=(req,res,next)=>{
    const productId = req.body.id;
    Product.deletebyId(productId);
    res.redirect('/admin/products');

}
exports.getProducts = (req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/products',{
            products:products,
            pageTitle:'All products',
            path:'/admin/products'
        });
     });  
}
