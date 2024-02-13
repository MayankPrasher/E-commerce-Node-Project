const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./util/database');
const multer = require('multer');
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
const fileStorage = multer.diskStorage({
    destination : (req , file , cb)=>{
        cb(null,'images');
    },
    filename: (req,file,cb)=>{
        cb(null,file.filename + '-' + file.originalname);
    }
});
const fileFilter = (req,file,cb)=>{
 if(
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
 ) {
    cb(null,true);
 }else{
    cb(null,false);
 }
};
app.set('view engine','ejs');

app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorcontroller = require('./controller/error');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:false}));

app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));

app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(
    session({secret:'user-data' , resave:false , saveUninitialized:false,store:store})
);
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
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
       next(new Error(err));
    }
);
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500',errorcontroller.get500);
app.use(errorcontroller.get404);

app.use((error,req,res,next)=>{
    console.log(error);
    res.status(500).render('500',
    {pageTitle:'Error!',
    path:'/505',
    isAuthenticated:req.session.isLoggedIn
    }); 
});


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
