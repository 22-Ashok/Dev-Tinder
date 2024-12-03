const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const userSchema = mongoose.Schema({
    name: {
        type:String,
        require:true,
        maxLength:20,
        minLength:3,
    },
    
    email: {
        type:String,
        require:true,
        maxLength:20,
        unique:true,
    },

    password: {
        type:String,
        require:true,
        validate: (value) => {
           const isStrongPass = validator.isStrongPassword(value, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})
           if(!isStrongPass) throw new Error('use symbol,uppercase,number')
        },
        trim:true
    }, 

    gender: {
        type:String,
        require:true,
        validate: (value) => {
            const genderBe = ['male','female','other'];
            if(!genderBe.includes(value)) throw new Error('incorrect gender')
        },
         trim:true
    }, 
    
    skills: {
        type:[String],  
        validate: (value) => {
            if(value.length>15) throw new Error('to many skills only 15 skills required');  
        }
    }, 

    DOB: {
        type:Date,
        trim:true,
        default:null
    }
}, 

{
    timestamps:true
})

// signup
userSchema.methods.encryptPassword = async function() {
    try{
        const hashpassword = await bcrypt.hash(this.password,10);
        return this.password = hashpassword;
    } catch(err) {
       throw new Error('err:',err.message);
    }  
}

//signin
userSchema.methods.decryptPassword = async function(plainPassword) {
   const isCorrectPassword = await bcrypt.compare(plainPassword, this.password)
   return isCorrectPassword;
}

//jwt token
userSchema.methods.generateToken = async function() {
    const {id,email} = this
    const token = await jwt.sign({id,email}, process.env.SECRET_KEY);
    return token;
}

module.exports = mongoose.model('User', userSchema)