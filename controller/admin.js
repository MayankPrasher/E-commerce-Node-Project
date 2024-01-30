const Product = require('../models/product');
const User = require('../models/user');
// // const mongodb = require('mongodb');

exports.getAddproduct = (req, res, next)=>{
    res.render('admin/edit-products',{
        pageTitle:'Add Product',
        path:'/admin/add-product',
        editing:false,
        isAuthenticated:req.session.isLoggedIn
        });
};
exports.postAddproduct=(req, res, next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.desc;
    const product = new Product({
        title:title,
        imageUrl:imageUrl,
        price:price,
        description:desc,
        userId:req.user
    });
    product.save()
      .then(result => {
        // console.log(result);
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch(err => {
        console.log(err);
      });
};
exports.getProducts = (req,res,next)=>{
      Product.find()
        .then(
            products=>{
                res.render('admin/products',{
                    products:products,
                    pageTitle:'All products',
                    path:'/admin/products',
                    isAuthenticated:req.session.isLoggedIn
                });
            }
           ).catch(
            err=>{
                console.log(err);
            }
           ); 
       
    }

exports.getEditproduct = (req, res, next)=>{
    const edit = req.query.edit;
        if(!edit){
            return res.redirect('/');
        }
        const productId = req.params.productId;
        // Product.findByPk(productId)
        Product.findById(productId)
        .then(product=>{
            if(!product){
                return res.redirect("/");
            }
            res.render('admin/edit-products',{
                pageTitle:'Edit product',
                path:'/admin/edit-products',
                editing : edit,
                product:product,
                isAuthenticated:req.session.isLoggedIn
            });
        })
        .catch(err=>console.log(err));
        
};
exports.postEditproduct=(req,res,next)=>{
    const productId = req.body.id;
    const updatedtitle = req.body.title;
    const updatedimgUrl = req.body.imageUrl;
    const updateddesc = req.body.desc;
    const updatedprice = req.body.price;
    // Product.findByPk(productId)
  Product.findById(productId).then(
    product=>{
        product.title = updatedtitle,
        product.imageUrl = updatedimgUrl,
        product.description = updateddesc,
        product.price = updatedprice
        return product.save()
    }
  ).then(result=>{
        console.log('UPDATED PRODUCT !');
        res.redirect('/admin/products');
    })
    .catch(err=>{console.log(err)});
}
exports.postDeleteproduct=(req,res,next)=>{
    const productId = req.body.id;
    Product.findByIdAndDelete(productId)
    .then(result=>{
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
}

