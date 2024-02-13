const fs = require('fs');
const path = require('path');
// const stripe = require('stripe')('sk_test_51OizmjSJO9ruBYianYCNvo8IMGhOm3VL5i5tW8gKfgUHx9RMoX4oowg3KCF8aEzOOGiFH5bvuEwvyoWoAlEv6t1A00i9OMew0B');
const crypto = require('crypto');
const axios = require('axios');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const PDFDocument = require('pdfkit');
const session = require('express-session');

// const customer = stripe.customers.create({
//     name: 'Jenny Rosen',
//     address: {
//       line1: '510 Townsend St',
//       postal_code: '98140',
//       city: 'San Francisco',
//       state: 'CA',
//       country: 'US',
//     },
//   });
const itemsPerPage = 2;
exports.getIndex=(req,res,next)=>{
   const page = +req.query.page||1;
   let totalItems;
   Product.find()
   .countDocuments()
   .then(numProducts=>{
    totalItems = numProducts;
    return Product.find()
    .skip((page-1)*itemsPerPage)
    .limit(itemsPerPage);
   }).then(
    products=>{
        res.render('shop/index',{
            products:products,
            pageTitle:'Shop',
            path:'/',
            isAuthenticated:req.session.isLoggedIn,
            currentPage : page ,
            hasNextPage: itemsPerPage*page<totalItems,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage : page - 1,
            lastPage : Math.ceil(totalItems/itemsPerPage)
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
    const page = +req.query.page||1;
   let totalItems;
   Product.find()
   .countDocuments()
   .then(numProducts=>{
    totalItems = numProducts;
    return Product.find()
    .skip((page-1)*itemsPerPage)
    .limit(itemsPerPage);
   }).then(
    products=>{
        res.render('shop/product-list',{
            products:products,
            pageTitle:'Products',
            path:'/products',
            isAuthenticated:req.session.isLoggedIn,
            currentPage : page ,
            hasNextPage: itemsPerPage*page<totalItems,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage : page - 1,
            lastPage : Math.ceil(totalItems/itemsPerPage)
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
            // console.log(products);
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
                res.redirect("/checkout");
                // res.render('shop/checkout',{
                //     path:'shop/checkout',
                //     pageTitle:'Checkout',
                //     isAuthenticated:req.session.isLoggedIn
                // })
               return order.save()
               
        }) 
    //  .then(()=>{
        
        // Order.find({'user.userId':req.user._id})
        // res.redirect('/checkout/'+req.user);
    //  })
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
exports.getCheckout = (req,res,next)=>{
    let products;
    let total = 0;
    req.user
    .populate('cart.items.productId')
    .then(user=>{
             products= user.cart.items;
            //  console.log(products);
             total = 0 ;
            products.forEach(p=>{
                total += p.quantity * p.productId.price;
            })
            res.render('shop/checkout',{
                        path:'/checkout',
                        pageTitle:'Checkout',
                        products:products,
                        totalSum:total,
                        // sessionId: session.id
                   });
        })
};
exports.postCheckout=(req,res,next)=>{
    let products;
    let total = 0;
    req.user
    .populate('cart.items.productId')
    .then(user=>{
             products= user.cart.items;
             total = 0 ;
            products.forEach(p=>{
                total += p.quantity * p.productId.price;
            })
            // return stripe.checkout.sessions.create({
            //    payment_method_types : ['card'],
            //    line_items: products.map(p=>{
            //     return {
            //         price_data :{
            //             currency : 'inr',
            //             unit_amount : p.productId.price,
            //             product_data:{
            //                 name :p.productId.title,
            //                 description:p.productId.desc,
            //             }
            //         },
            //         quantity : p.quantity,
            //     };
            //    }),
            //    mode: 'payment',
            //    success_url : req.protocol + '://' + req.get('host') + '/checkout/success',
            //    cancel_url : req.protocol + '://' + req.get('host') + '/checkout/cancel'
            // });
            const data = {
                "merchantId": "PGTESTPAYUAT",
                "merchantTransactionId": "MT7850590068188104",
                "merchantUserId": "MUID123",
                "amount": total*100,
                "redirectUrl": "http://localhost:3000/orders",
                "redirectMode": "REDIRECT",
                // "callbackUrl": "https://webhook.site/callback-url",
                "mobileNumber": "9999999999",
                "paymentInstrument": {
                  "type": "PAY_PAGE"
                }
              }
              const payload = JSON.stringify(data);
              const payloadMain = Buffer.from(payload).toString('base64');
              const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
              const keyIndex = 1;
              const string = payloadMain + '/pg/v1/pay'+key;
              const sha256 = crypto.createHash('sha256').update(string).digest('hex');
              const checksum = sha256 + "###" +keyIndex;
                const options = {
                method: 'post',
                url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
                headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-VERIFY':checksum
                                },
                data: {
                    request : payloadMain
                }
                };
                axios
                .request(options)
                    .then(function (response) {
                    res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
                    // return response.data;
                })
                .then(result=>{
                    return req.user.clearCart();
             })
    //             .catch(function (error) {
    //                 console.error(error);
    //             });
           
           
    })
    // .then(session=>{
    //     res.render('shop/checkout',{
    //         path:'/checkout',
    //         pageTitle:'Checkout',
    //         products:products,
    //         totalSum:total,
    //         // sessionId: session.id
    //    });
    // })
    .catch(err=>{ 
       
        const error = new Error(err);
        error.httpsStatusCode = 500;
        return next(error);
    });
    
};
