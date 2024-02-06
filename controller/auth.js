const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const {validationResult} = require('express-validator');
// var Mailgun = require('mailgun').Mailgun;

// var mg = new Mailgun('3919de6d2157e27cc681fe553429f2a0-69a6bd85-6b0c9c8e');
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rosario.torphy@ethereal.email',
        pass: '6qhnCSKuejbqGUX2Rc'
    }
});
exports.getLogin = (req,res,next)=>{
    // const isLoggedIn = req.get('Cookie').split('=')[1];
    // console.log(req.session.isLoggedIn);
    let message = req.flash('error');
    if(message.length>0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/login',{
        pageTitle:'Login',
        path:'/login',
        errorMessage:message
        });
}
exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('auth/login',{
            pageTitle:'Login',
            path:'/login',
            errorMessage:errors.array()[0].msg
            });
    }
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            req.flash('error','Invalid Email or Password.');
            return res.redirect('/login');
        }
        bcrypt.compare(password,user.password)
        .then(match=>{
            if(match){
                req.session.isLoggedIn=true;
                req.session.user = user;
               return req.session.save(err=>{
                    console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error','Invalid Email or Password.');
            res.redirect('/login');
        })
        .catch(err=>{
            console.log(err);
            res.redirect('/login');
        });
   
})
.catch(err=>console.log(err));
}
exports.postLogout = (req,res,next)=>{
    req.session.destroy(
        err=>{
            console.log(err);
        } 
    )
    res.redirect('/');
}
exports.getSignup = (req,res,next)=>{
     // console.log(req.session.isLoggedIn);
     let message = req.flash('error');
     if(message.length>0){
         message = message[0];
     }else{
         message = null;
     }
    res.render('auth/signup',{
        pageTitle:'SignUp',
        path:'/signup',
        errorMessage:message,
        oldInput :{email:'',password:'',confirmPassword:''},
        validationErrors:[]
        });
}
exports.postSignup = (req,res,next)=>{

    const email = req.body.email;
    const password = req.body.password;
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('auth/signup',{
            pageTitle:'SignUp',
            path:'/signup',
            errorMessage:errors.array()[0].msg,
            oldInput :{email:email,password:password,confirmPassword:req.body.confirmPassword},
            validationErrors:errors.array()
            });
    }
    // User.findOne({email:email})
    // .then(userInfo=>{
    //     if(userInfo){
    //         req.flash('error','Email already exists .');
    //         res.redirect("/signup");
    //    }
     bcrypt
       .hash(password,12)
       .then(hashedPassword=>{  const user = new User({
        email : email,
        password : hashedPassword,
        cart : {items : []}
    });
    user.save();
})
.then(result=>{
    res.redirect('/login');
    return transporter.sendMail({
        to :email,
        from:"prasher6789@gmail.com",
        subject:"Signup succeeded!",
        html:'<h1>You successfully signed up!'
    }).catch(err=>{
       console.log(err);
    });
   
})

};
exports.getReset = (req,res,next)=>{
    
    let message = req.flash('error');
    if(message.length>0){
        message = message[0];
    }else{
        message = null;
    }
   res.render('auth/reset',{
       pageTitle:'Reset Password',
       path:'/reset',
       errorMessage:message
       });
}
exports.postReset = (req,res,next)=>{
crypto.randomBytes(32,(err,Buffer)=>{
    if(err){
        console.log(err);
        return re.redirect('/reset');
    }
    const token = Buffer.toString('hex');
    const email = req.body.email;
    User.findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            req.flash('error','Email not found');
            return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now()+3600000;
        return user.save();
    })
    .then(result=>{
        res.redirect('/');
        transporter.sendMail({
            to :email,
            from:"prasher6789@gmail.com",
            subject:"Reset Password",
            html:`
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">Reset Password</a> to set new Password</p>
            <p>This link will expire after 1 hour</p>
            `
        });
    })
    .catch((err=>{
        console.log(err);
    }));
    
})
};

exports.getNewPassword = (req,res,next)=>{

    const token = req.params.token;
    User.findOne({resetToken:token, resetTokenExpiration:{$gt:Date.now()}})
    .then(user=>{
        let message = req.flash('error');
        if(message.length>0){
            message = message[0];
        }else{
            message = null;
        }
        res.render('auth/newpassword',{
            pageTitle:'New Password',
            path:'/newpassword',
            errorMessage:message,
            userId:user._id.toString(),
            passwordToken:token
            });
    })
    .catch((err)=>{
        console.log(err);
    });
   
    
}
exports.postnewPassword = (req,res,next)=>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({resetToken : passwordToken,
    resetTokenExpiration:{$gt: Date.now()},
    _id:userId
}).then(
    user=>{
        resetUser = user
        return bcrypt.hash(newPassword,12);
    }
)
.then(hashedPassword=>{
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();

})
.then(result=>{
    res.redirect('/login');
})
.catch((err)=>{
    console.log(err);
})
}