const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  title:Sequelize.STRING,
  price:{
    type:Sequelize.DOUBLE,
    allowNull:false
  },
  imageUrl:{
    type:Sequelize.STRING,
    allowNull:false
  },
  description:{
    type: Sequelize.STRING,
    allowNull:false
  }
});

module.exports = Product;
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