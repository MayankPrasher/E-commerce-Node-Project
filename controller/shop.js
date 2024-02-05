const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getIndex=(req,res,next)=>{
   Product.find().then(
    products=>{
        res.render('shop/index',{
            products:products,
            pageTitle:'Shop',
            path:'/',
            isAuthenticated:req.session.isLoggedIn
        });
    }
   ).catch(
    err=>{
        console.log(err);
    }
   ); 
    
};
exports.getProducts=(req, res, next)=>{
    Product.find().then(
        products=>{
            res.render('shop/product-list',{
                products:products,
                pageTitle:'All products',
                path:'/products',
                isAuthenticated:req.session.isLoggedIn
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
    Product.findById(productId)
    .then(product=>{
        res.render('shop/product-details',{
          product : product,
          pageTitle:'product',
          path:'product-detail',
          isAuthenticated:req.session.isLoggedIn
        });
       
    }).catch(err=>console.log(err));
};
exports.getCart=(req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .then(user=>{
            const products =user.cart.items;
            console.log(products);
            res.render('shop/cart',{
                            path:'/cart',
                            pageTitle:'Your cart',
                            products:products,
                            isAuthenticated:req.session.isLoggedIn
                       });
    })
    .catch(err=>console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        res.redirect('/cart');
      });
}
exports.postdeleteCartproduct =(req,res,next)=>{
        const productId = req.body.productId;
        req.user
        .removeFromCart(productId)
        .then(result=>{
            res.redirect('/cart');
        })
        .catch(err=>console.log(err));
    };

    exports.postOrders = (req,res,next)=>{
     req.user
     .populate('cart.items.productId')
     .then(
        user=>{
            const products = user.cart.items.map(
                i=>{
                    return{product:{...i.productId._doc},quantity: i.quantity};
                });
                const order = new Order({
                    user:{
                        email:req.user.email,
                        userId:req.user
                    },
                    products:products
                });
               return order.save();
        }) .then(result=>{
            return req.user.clearCart();
     })
     .then(()=>{
        res.redirect('/orders');
     })
     .catch(err=>console.log(err));
    };

    exports.getOrders=(req,res,next)=>{
       
        Order.find({'user.userId':req.user._id})
        .then(orders=>{
            res.render('shop/order',{
                path:'shop/orders',
                pageTitle:'Your Orders',
                orders:orders,
                isAuthenticated:req.session.isLoggedIn
            })
        })
             
        };
// // exports.getCheckout=(req,res,next)=>{
// //      res.render('shop/checkout',{
// //         path:'/checkout',
// //         pageTitle:'checkout'
// //      })
// // };
// //
// // 