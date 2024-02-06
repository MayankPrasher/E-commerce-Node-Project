const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./util/database');

const csrf = require('csurf');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const MONGODB_URI ='mongodb+srv://prasher6789:Mayank%401509@cluster0.dxwz3zy.mongodb.net/shop';
const app = express();
const store = new MongoDBStore({
 uri:MONGODB_URI,
 collection : 'sessions'
});
const csrfProtection = csrf();
app.set('view engine','ejs');

app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorcontroller = require('./controller/404');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));
app.use(
    session({secret:'user-data' , resave:false , saveUninitialized:false,store:store})
);
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        if(!user){
            return next();
        }
    req.user = user;
    next();
})
.catch(
    err=>{
        throw new Error(err);
    }
);
})
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorcontroller.geterror);


mongoose.connect(MONGODB_URI)
.then(
    // result=>{
    //     User.findOne().then(user=>{
    //       if(!user){
    //           const user = new User({
    //              name:'Mayank',
    //              email:'prasher@gmail.com',
    //              cart:{
    //                  items:[]
    //              }
    //           });
    //              user.save();
    //       }
    //     });
        app.listen(3000)
    // }
).catch(err=>{
    console.log(err);
})
