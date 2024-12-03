const {z, string} = require('zod');
const mongoose = require('mongoose')

// signup validation
const signUpValidation = z.object({
    name:z.string().max(20,{message:"name must be atmost 20 character"}).min(3,{message:"name must be atleast 3 character"}).trim(),
    email:z.string().email().max(20),
    password:z.string().max(15).regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
  "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character"),
  gender:z.string().refine((value) => {
    const newValue = value.toLowerCase();
    return ['male','female','other'].includes(newValue);
  }, {
    message:"only allowed gender male,female and other"
  })
});

// signin validation
const signinValidation = z.object({
  email:z.string().email().min(5),
  password:z.string().max(15)
})

module.exports = { signUpValidation, signinValidation } 