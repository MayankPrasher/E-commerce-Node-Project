const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title :{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  imageUrl:{
    type:String,
    required:true
  }
});
module.exports = mongoose.model('Product',productSchema);
// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');

// class Product{
//   constructor(title,price,description,imageUrl,id,userId){
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }
  
//   save(){
//     const db = getDb();
//     let dbOp;
//     if(this._id){
//      dbOp = db.collection('products').updateOne({_id: this._id },{$set:this});
//     }
//     else{
//       dbOp =db.collection('products').insertOne(this);

//     }
//     return dbOp.then(result=>{
//       console.log(result);
//     }).catch(
//       console.log(err=>console.log(err))
//       );
//     }

//     static fetchAll(){
//       const db = getDb();
//       return db.collection('products')
//       .find()
//       .toArray()
//       .then(products=>{
//        console.log(products);
//        return products;
//       }).catch(err=>console.log(err));
//     }
//     static fetchById(productId){
//       const db = getDb();
//       return db.collection('products')
//       .find({ _id : new mongodb.ObjectId(productId)})
//       .next()
//       .then(product=>{
//         return product;
//       })
//       .catch(err=>console.log(err));
//     }
//     static deleteById(productId){
//       const db = getDb();
//       return db
//       .collection('products')
//       .deleteOne({_id:new mongodb.ObjectId(productId)})
//       .then(result=>{
//         console.log('Deleted');
//       })
//       .catch(err=>console.log(err));
//     }
//   }
//   module.exports = Product;

// const Product = sequelize.define('product',{
//   id:{
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   },
//   title:Sequelize.STRING,
//   price:{
//     type:Sequelize.DOUBLE,
//     allowNull:false
//   },
//   imageUrl:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   description:{
//     type: Sequelize.STRING,
//     allowNull:false
//   }
// });

// const fs = require('fs');
// const path = require('path');
// const Cart = require('../models/cart');
// const p = path.join(
//     path.dirname(process.mainModule.filename),
//     'data',
//     'products.json'
//   );
// const getProductsFromFile = cb =>{
//       fs.readFile(p, (err, fileContent) => {
//         if (err) {
//           cb([]);
//         }
//         else{
//         cb(JSON.parse(fileContent));
//         }
//       });
// }

// module.exports = class Product {
//   constructor(id,title,imageUrl,desc,price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.desc = desc;
//     this.price = price;
//   }

//   save() {
   
//     getProductsFromFile(products=>{
//         if(this.id){
//             const existingProductIndex = products.findIndex(p=>p.id===this.id);
//             const updatedProduct = [...products];
//             updatedProduct[existingProductIndex]=this;
//             fs.writeFile(p, JSON.stringify(updatedProduct), err => {
//                 console.log(err);
//               });
//         }
//         else{
//             this.id = Math.random().toString();
//             products.push(this);
//             fs.writeFile(p, JSON.stringify(products), err => {
//               console.log(err);
//             });
//         }
       
//     });
//   }

//   static fetchAll(cb) {
//     getProductsFromFile(cb);
//   }
//   static findbyId(id,cb){
//     getProductsFromFile(products=>{
//         const product = products.find(p => p.id === id);
//         cb(product);
//     });
//   }
//   static deletebyId(id){
//     getProductsFromFile(products=>{
//         const product = products.find(p => p.id === id);
//         const updatedProducts = products.filter(p => p.id !== id);
//         fs.writeFile(p,JSON.stringify(updatedProducts),err=>{
//             if(!err){
//              Cart.deleteProduct(id,product.price);
//             }
//         })
//     });
//   }
// };
