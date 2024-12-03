const express = require('express');
const router = express.Router();
const UserModel = require('../models/userSchema')
const  { signUpValidation, signinValidation }  = require('../utils/validation')

// signup
router.post('/signup', async (req,res) => {

    try{
       const isValid = signUpValidation.safeParse(req.body);
       if(!isValid.success) {
          throw new Error(isValid.error.errors[0].message);
       } else {
          const user = UserModel({
            name:req?.body?.name,
            email:req?.body?.email,
            password:req?.body?.password,
            gender:req?.body?.gender,
            DOB:req?.body?.DOB
          });

          await user.encryptPassword();
          user.save();
          res.send('user signup successfully');
       }
        
    } catch(err) {
        if(err.code == 11000){
            res.status(403).send('err: email is already present')
        } else {
            res.status(404).send('err:'+ err.message);
        }  
    } 
})

//signin
router.post('/signin', async (req,res) => {
   try{
     // input validation
      const {email,password} = req.body;
      const isValid = signinValidation.safeParse({email,password})
      if(!isValid.success) {
        throw new Error('incorrect email or password');
      } 

     // check email and password in db
     const isUserPresent = await UserModel.findOne({email});
     if(!isUserPresent) throw new Error('email not found');
     const isPasswordCorrect = await isUserPresent.decryptPassword(password); 
     if(!isPasswordCorrect) throw new Error('Incorrect password');
     else {
        // gives user jwt token as cookies
         res.cookie('token', await isUserPresent.generateToken());
         res.status(200).send('signin successfully');
     }
     
   } 
   catch(err) {
    res.status(401).send(`err:${err.message}`);
   }
})

// signout
router.post('/signout', async (req,res) => {
     res.clearCookie('token');
     res.status(200).send('signout successfully');
})

module.exports = router