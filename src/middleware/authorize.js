const jwt = require('jsonwebtoken')
require('dotenv').config()
const UserModel = require('../models/userSchema')

async function authorizedUser (req,res,next) {

    try{
        const token = req.cookies.token;
        if(token) {
           const {id} = await jwt.verify(token, process.env.SECRET_KEY);
           const user = await UserModel.findById(id);
           req.user = user;
           next()
        } 

        else  throw new Error('Signin to access profile')
    } 
    
    catch(err) {
       res.status(404).send(`err:${err.message}`)
    }
   
}  

module.exports = authorizedUser 