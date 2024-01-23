const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex=(req,res,next)=>{
   Product.findAll().then(
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
    Product.findAll().then(
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
    Product.findByPk(productId)
    .then(product=>{
        res.render('shop/product-details',{
          product : product,
          pageTitle:product.title,
          path:'product-detail'
        });
    }).catch(err=>console.log(err));
};
exports.getCart=(req,res,next)=>{
    req.user.getCart()
    .then(cart=>{
        return cart.getProducts()
        .then(products=>{
            res.render('shop/cart',{
                            path:'/cart',
                            pageTitle:'Your cart',
                            products:products
                       });
        }).catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
};

exports.postCart=(req,res,next)=>{
    const productId = req.body.productId;
    let fetchedCart ;
    let newQuantity = 1;
    req.user.getCart()
    .then(cart=>{
        fetchedCart = cart;
        return cart.getProducts({where:{id:productId}});
    })
    .then(products=>{
        let product;
        if(products.length>0){
            products = products[0];
        }
    
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity+1; 
            return product;
        }
        return Product.findByPk(productId)
    })
    .then(product=>{
        return fetchedCart.addProduct(product,{through:{quantity:newQuantity}});
    })
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>console.log(err));
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