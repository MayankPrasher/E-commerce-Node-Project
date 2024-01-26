const Product = require('../models/product');
// const Cart = require('../models/cart');

exports.getIndex=(req,res,next)=>{
   Product.fetchAll().then(
    products=>{
        res.render('shop/index',{
            products:products,
            pageTitle:'Shop',
            path:'/'
        });
    }
   ).catch(
    err=>{
        console.log(err);
    }
   ); 
    
};
exports.getProducts=(req, res, next)=>{
    Product.fetchAll().then(
        products=>{
            res.render('shop/product-list',{
                products:products,
                pageTitle:'All products',
                path:'/products'
            });
        }
       ).catch(
        err=>{
            console.log(err);
        }
       ); 
};

exports.getProduct=(req,res,next)=>{
    const productId = req.params.productId;
    Product.fetchById(productId)
    .then(product=>{
        res.render('shop/product-details',{
          product : product,
          pageTitle:'product',
          path:'product-detail'
        });
       
    }).catch(err=>console.log(err));
};
exports.getCart=(req,res,next)=>{
    req.user.getCart()
    .then(products=>{
            res.render('shop/cart',{
                            path:'/cart',
                            pageTitle:'Your cart',
                            products:products
                       });
    })
    .catch(err=>console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.fetchById(prodId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        console.log(result);
        res.redirect('/cart');
      });
}
exports.postdeleteCartproduct =(req,res,next)=>{
        const productId = req.body.productId;
        req.user
        .deleteItemFromCart(productId)
        .then(result=>{
            res.redirect('/cart');
        })
        .catch(err=>console.log(err));
    };

    exports.postOrders = (req,res,next)=>{
     let fetchedCart;
     req.user.addOrder()
     .then(result=>{
        res.redirect('/orders');
     })
     .catch(err=>console.log(err));
    };
    exports.getOrders=(req,res,next)=>{
        req.user
        .getOrders()
        .then(orders=>{
            res.render('shop/order',{
                path:'shop/orders',
                pageTitle:'Your Orders',
                orders:orders
            })
        })
             
        };
// exports.getCheckout=(req,res,next)=>{
//      res.render('shop/checkout',{
//         path:'/checkout',
//         pageTitle:'checkout'
//      })
// };
//
// 