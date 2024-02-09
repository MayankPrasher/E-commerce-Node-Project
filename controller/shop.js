const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const PDFDocument = require('pdfkit');

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
        const error = new Error(err);
        error.httpsStatusCode = 500;
        return next(error);
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
            const error = new Error(err);
            error.httpsStatusCode = 500;
            return next(error);
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
       
    }).catch(err=>{
        const error = new Error(err);
        error.httpsStatusCode = 500;
        return next(error);
    });
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
    .catch(err=>{ const error = new Error(err);
        error.httpsStatusCode = 500;
        return next(error);});
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
        .catch(err=>{ const error = new Error(err);
            error.httpsStatusCode = 500;
            return next(error);});
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
     .catch(err=>{ const error = new Error(err);
        error.httpsStatusCode = 500;
        return next(error);});
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

exports.getInvoice = (req,res,next) =>{
    const orderId = req.params.orderId;
    Order.findById(orderId).then(order=>{
        if(!order){
            return next(new Error('No order found'));
        }
        if(order.user.userId.toString()!== req.user._id.toString()){
            return next(new Error('Unauthorized'));
        }
        const invoiceName = 'invoice-'+orderId+'.pdf';
    const invoicePath = path.join('data','invoices',invoiceName);
    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    
    pdfDoc.fontSize(26).text('Invoice',{
        underline:true
    });
    pdfDoc.text('-------------------');
    let totalPrice = 0;
    order.products.forEach(prod=>{
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
        .fontSize(14)
        .text(
            prod.product.title +
            ' - ' +
            prod.quantity +
            ' X ' +
            'INR' +
            prod.product.price
        );
    });
    pdfDoc.text('----');
    pdfDoc.fontSize(20).text('Total Price: INR'+ totalPrice);
    pdfDoc.end();
    
    // fs.readFile(invoicePath,(err,data)=>{
    //     if(err){
    //         return next(err);
    //     }
    //     res.setHeader('Content-Type','application/pdf');
    //     res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    //     res.send(data);
    // });
    
    }).catch(err=>next(err));
    
};
// // exports.getCheckout=(req,res,next)=>{
// //      res.render('shop/checkout',{
// //         path:'/checkout',
// //         pageTitle:'checkout'
// //      })
// // };
// //
// // 