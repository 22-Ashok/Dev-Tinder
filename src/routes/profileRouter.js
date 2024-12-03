const express = require('express');
const router = express.Router();
const authorizedUser = require('../middleware/authorize')
const UserModel = require('../models/userSchema')
const z = require('zod');

// profile view
router.get('/profile/view', authorizedUser, async (req,res) => {
// first check user is logged in 
    try{
        const user = req.user;
         if(!user) throw new Error("something went wrong");
        res.status(200).send(user);
    } 
    catch (err) {
        res.status(401).send(`err:${err.message}`);
    }  
})

// edit profile
router.patch('/profile/edit', authorizedUser, async (req,res) => {

    try {
        const user = req.user;
        const editAllow = ['name','gender','DOB','skills'];
        const arrFeild = Object.keys(req.body);
        const isCorrectData = arrFeild.every((fieldValue) => editAllow.includes(fieldValue));
        if(!isCorrectData) throw new Error('invalid field found to be update');
        else {
            const {id} = user;
            arrFeild.forEach((value) => {
              user[value] = req.body[value];
           })

           await UserModel.findByIdAndUpdate(id,user);
           user.save();
           res.status(200).send(`user updated successfully ${user}`);
        }
    } 
    
    catch (err) {

       res.status(401).send(`err: ${err.message}`);
    }
    
})

// password change
router.patch('/profile/password-edit',authorizedUser, async (req,res) => {
    try{
        const user = req.user;
        const isStrongPassword = z.object({
            password:z.string().max(15).regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
  "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character")
        })
         // validate password
          const isPasswordValid = isStrongPassword.safeParse(req.body);
            if(!isPasswordValid.success) throw new Error('weak password');
             
         // encrypt password
            user.password = req.body.password;
            await user.encryptPassword();
            await user.save()          //save to db
            res.status(200).send('password updated successfully');       
    } 
    
    catch(err) {
       res.status(400).send(`err: ${err.message}`);
    }
   
})


module.exports = router  