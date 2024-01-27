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

app.use((req,res,next)=>{
User.findById('65b4a8eea510747f5e24a3ee')
.then(user=>{
    req.user = user;
    next();
})
.catch(err=>console.log(err));
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorcontroller.geterror);


mongoose.connect('mongodb+srv://prasher6789:Mayank%401509@cluster0.dxwz3zy.mongodb.net/shop')
.then(
    result=>{
        User.findOne().then(user=>{
          if(!user){
              const user = new User({
                 name:'Mayank',
                 email:'prasher@gmail.com',
                 cart:{
                     items:[]
                 }
              });
                 user.save();
          }
        });
        app.listen(3000);
    }
).catch(err=>{
    console.log(err);
})
