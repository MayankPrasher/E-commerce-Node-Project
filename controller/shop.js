const Product = require('../models/product');
const Cart = require('../models/cart');

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
    Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts = [];
                for(let product of products){
                    const cartProductsdata = cart.products.find(p=> p.id === product.id)
                    if(cartProductsdata){
                      cartProducts.push({productData:product,qty:cartProductsdata.qty});
                    }
                }
                res.render('shop/cart',{
                path:'/cart',
                pageTitle:'Your cart',
                products:cartProducts
           });
        });   
    });
};

exports.postCart=(req,res,next)=>{
    const productId = req.body.productId;
    Product.findbyId(productId,(product)=>{
       Cart.addProduct(productId,product.price);
    });
    res.redirect('/');
}
exports.getCheckout=(req,res,next)=>{
     res.render('shop/checkout',{
        path:'/checkout',
        pageTitle:'checkout'
     })
};
exports.postdeleteCartproduct =(req,res,next)=>{
    const productId = req.body.productId;
    Product.findbyId(productId,product=>{
        Cart.deleteProduct(productId,product.price);
        res.redirect("/cart");
    });
};
exports.getOrders=(req,res,next)=>{
        res.render('shop/orders',{
        path:'/orders',
        pageTitle:'Your Orders'
    })
};