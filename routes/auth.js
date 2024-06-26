const express = require('express');
const {check,body} = require('express-validator');
const router = express.Router();
const authController = require('../controller/auth');
const IsAuth = require('../middleware/isAuth');
const User = require('../models/user');

router.get('/login',authController.getLogin);

router.post('/login',[
    check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Enter the valid email.'),
    // .custom((value,{req})=>{
    // User.findOne({email:value})
    // .then(user=>{
    //     if(!user){
    //         return Promise.reject('User not exists!!!');
    //     }
    // })
    // .catch(err=>console.log(err))
    // }),
    body('password',
    'Enter password with atleast 5 characters without special characters.')
    .isLength({min:5})
    .isAlphanumeric()
    .trim()
]
,authController.postLogin);


router.post('/logout',authController.postLogout);
router.get('/signup',authController.getSignup);

router.post('/signup',
[
check('email')
.isEmail()
.withMessage('Enter the valid email.')
.normalizeEmail()
.custom((value,{req})=>{
    return User.findOne({email:value})
    .then(userInfo=>{
        if(userInfo){
           return Promise.reject('Email already exists!!!');
       }
})
}),
body('password',
'Enter password with atleast 5 characters without special characters.')
.isLength({min:5})
.isAlphanumeric()
.trim(),
body('confirmPassword').trim().custom((value,{req})=>{
    if(value !== req.body.password){
        throw new Error('Passwords doesnt match!');
    }
    return true;
})
],
authController.postSignup);

router.get('/reset',authController.getReset);
router.post('/reset',authController.postReset);
router.get('/reset/:token',authController.getNewPassword);
router.post('/newpassword',authController.postnewPassword);

module.exports = router;