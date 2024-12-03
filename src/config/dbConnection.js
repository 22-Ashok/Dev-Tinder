const mongoose = require('mongoose');

function connectDB(){
   return mongoose.connect(process.env.Database_String);
}

module.exports = connectDB 

