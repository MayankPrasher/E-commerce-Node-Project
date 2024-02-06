const Product = require('../models/product');
const User = require('../models/user');
const {validationResult} = require('express-validator');
// // const mongodb = require('mongodb');

exports.getAddproduct = (req, res, next)=>{
    res.render('admin/edit-products',{
        pageTitle:'Add Product',
        path:'/admin/add-product',
        editing:false,
        hasError:false,
        errorMessage:null,
        isAuthenticated:req.session.isLoggedIn,
        validationErrors:[]
        });
};
exports.postAddproduct=(req, res, next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.desc;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
       return res.status(422).render('admin/edit-products',{
            pageTitle:'Add product',
            path:'/admin/edit-products',
            editing : false,
            hasError:true,
            product:{
                title:title,
                imageUrl:imageUrl,
                price:price,
                description:desc
            },
            isAuthenticated:req.session.isLoggedIn,
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        });

    }

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
      Product.find({userId:req.user._id})
        .then(
            products=>{
                res.render('admin/products',{
                    products:products,
                    pageTitle:'All products',
                    path:'/admin/products',
                    hasError:false,
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
        const errors = validationResult(req);
        Product.findById(productId)
        .then(product=>{
            if(!product){
                return res.redirect("/");
            }
            res.render('admin/edit-products',{
                pageTitle:'Edit product',
                path:'/admin/edit-products',
                editing : edit,
                hasError:false,
                product:product,
                errorMessage:null,
                isAuthenticated:req.session.isLoggedIn,
                validationErrors:errors.array()
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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
       return res.status(422).render('admin/edit-products',{
            pageTitle:'Edit product',
            path:'/admin/edit-products',
            editing : true,
            hasError:true,
            product:{
                title:updatedtitle,
                imageUrl:updatedimgUrl,
                price:updatedprice,
                description:updateddesc,
                id:productId
            },
            isAuthenticated:req.session.isLoggedIn,
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()
        });

    }
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

