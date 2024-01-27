const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./util/database');
const app = express();
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


app.set('view engine','ejs');

app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorcontroller = require('./controller/404');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

// app.use((req,res,next)=>{
// User.findById('65b2575eee179b7f274cd8d1')
// .then(user=>{
//     req.user = new User(user.name,user.email,user.cart,user._id);
//     next();
// })
// .catch(err=>console.log(err));
// });

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorcontroller.geterror);


mongoose.connect('mongodb+srv://prasher6789:Mayank%401509@cluster0.dxwz3zy.mongodb.net/shop')
.then(
    result=>{
        
        app.listen(3000);
    }
).catch(err=>{
    console.log(err);
})
