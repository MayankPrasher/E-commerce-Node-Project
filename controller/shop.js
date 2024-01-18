const Product = require('../models/product');

exports.getIndex=(req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('shop/index',{
            products:products,
            pageTitle:'Shop',
            path:'/'
        });
     });  
};
exports.getProducts=(req, res, next)=>{
    Product.fetchAll((products)=>{
       res.render('shop/product-list',{
           products:products,
           pageTitle:'All products',
           path:'/products'
       });
    });  
   };
exports.getProduct=(req,res,next)=>{
    const productId = req.params.productId;
    Product.findbyId(productId,product=>{
        res.render('shop/product-details',{
          product : product,
          pageTitle:product.title,
          path:'product-detail'
        })
    });
};
exports.getCart=(req,res,next)=>{
   res.render('shop/cart',{
        path:'/cart',
        pageTitle:'Your cart'
   });
};

exports.postCart=(req,res,next)=>{
    const productId = req.body.productId;
    console.log(productId);
    res.redirect('/');
}
exports.getCheckout=(req,res,next)=>{
     res.render('shop/checkout',{
        path:'/checkout',
        pageTitle:'checkout'
     })
};

exports.getOrders=(req,res,next)=>{
        res.render('shop/orders',{
        path:'/orders',
        pageTitle:'Your Orders'
    })
};