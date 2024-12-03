const mongoose = require('mongoose');

const connection = new mongoose.Schema({
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
    }, 
    status: {
      type:String,
      enum:{
        values: ["like","pass","accepted","rejected"],
        message: '{VALUE} is not supported'
      },
      required:true
    }
}, 
{
  timestamps:true
}) 

connection.index = {fromUserId:1, toUserId:1}

module.exports = mongoose.model('Connection', connection )