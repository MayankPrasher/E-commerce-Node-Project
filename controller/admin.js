const Product = require('../models/product');

exports.getAddproduct = (req, res, next)=>{
    res.render('admin/edit-products',{
        pageTitle:'Add Product',
        path:'/admin/add-product',
        editing:false
        });
};
exports.postAddproduct=(req, res, next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const desc = req.body.desc;
    req.user.createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: desc
    })
      .then(result => {
        // console.log(result);
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch(err => {
        console.log(err);
      });
    // const product = new Product(null,title,imageUrl,desc,price);
    // product.save();
    // res.redirect("/"); 
};
exports.getEditproduct = (req, res, next)=>{
    const edit = req.query.edit;
    console.log(edit);
        if(!edit){
            return res.redirect('/');
        }
        const productId = req.params.productId;
        // Product.findByPk(productId)
        req.user.getProducts({where:{id:productId}})
        .then(product=>{
            if(!product){
                return res.redirect("/");
            }
            res.render('admin/edit-products',{
                pageTitle:'Edit product',
                path:'/admin/edit-products',
                editing : edit,
                product:product
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
    Product.findByPk(productId)
    .then(product=>{
        product.title = updatedtitle;
        product.price = updatedprice;
        product.description = updateddesc;
        product.imageUrl = updatedimgUrl;
        return product.save();
    })
    .then(result=>{
        console.log('UPDATED PRODUCT !');
        res.redirect('/admin/products');
    })
    .catch(err=>{console.log(err)});
}
exports.postDeleteproduct=(req,res,next)=>{
    const productId = req.body.id;
    Product.findByPk(productId)
    .then(product=>{
        return product.destroy();
    })
    .then(result=>{
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
}
exports.getProducts = (req,res,next)=>{
    req.user.getProducts()
    .then(
        products=>{
            res.render('admin/products',{
                products:products,
                pageTitle:'All products',
                path:'/admin/products'
            });
        }
       ).catch(
        err=>{
            console.log(err);
        }
       ); 
   
}