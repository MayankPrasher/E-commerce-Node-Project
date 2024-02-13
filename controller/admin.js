const product = require('../models/product');
const Product = require('../models/product');
const User = require('../models/user');
const fileHelper = require('../util/file');
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
    const image = req.file;
    const price = req.body.price;
    const desc = req.body.desc;
    if(!image){
        return res.status(422).render('admin/edit-products',{
            pageTitle:'Add product',
            path:'/admin/edit-products',
            editing : false,
            hasError:true,
            product:{
                title:title,
                price:price,
                description:desc
            },
            isAuthenticated:req.session.isLoggedIn,
            errorMessage:'Attach jpg/png/jpeg files only',
            validationErrors:[]
        });

    }
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
    const imageUrl = image.path;
    const product = new Product({
        title:title,
        imageUrl:imageUrl,
        price:price,
        description:desc,
        userId:req.user
    });
    product.save()
      .then(result => {
        // console.log(result);'
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch(err => {
        // console.log(err);
        // res.redirect('/500');
        const error = new Error(err);
        error.httpsStatusCode = 500;
        return next(error);
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
                const error = new Error(err);
                error.httpsStatusCode = 500;
                return next(error);
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
            // throw new Error('Dummy');
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
        .catch(err=>{
            const error = new Error(err);
            error.httpsStatusCode = 500;
            return next(error);
        });
        
};
exports.postEditproduct=(req,res,next)=>{
    const productId = req.body.id;
    const updatedtitle = req.body.title;
    const image = req.file;
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
        product.title = updatedtitle;
        if(image){
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
        }
        product.description = updateddesc;
        product.price = updatedprice;
        return product.save()
    }
  ).then(result=>{
        console.log('UPDATED PRODUCT !');
        res.redirect('/admin/products');
    })
    .catch(err=>{ const error = new Error(err);
        error.httpsStatusCode = 500;
        return next(error);});
}
exports.deleteproduct=(req,res,next)=>{
    const productId = req.params.productId;
    Product.findById(productId).then(
        product => {
            if(!product){
                return next(new Error('Product not Found.'));
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.findByIdAndDelete(productId);
        }
    ).then(result=>{
        console.log('DESTROYED PRODUCT');
        // res.redirect('/admin/products');
        res.status(200).json({message:'Success!'});
    })
    .catch(err=>{ 
        res.status(500).json({message:'Deleting product failed'});
        // const error = new Error(err);
        // error.httpsStatusCode = 500;
        // return next(error)
    });
    
    
    
}

