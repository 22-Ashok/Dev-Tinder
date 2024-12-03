const express = require('express');
const routes = express.Router();
const UserModel = require('../models/userSchema')
const ConnectionModel = require('../models/connectionSchema')
const authorizedUser = require('../middleware/authorize')

// send request to user
routes.post('/connection/:status/:toUserId', authorizedUser, async (req,res) => {
    try{
      const user = req.user;
      const {status,toUserId} = req.params;
      const fromUserId = user._id
      const isStatus = ['like','pass'];
      // checks the status
      if(!isStatus.includes(status)) return res.status(400).json({err:'invalid status'});

      if(fromUserId.equals(toUserId)) return res.status(400).json({err:'request not send!!!'});

      // checks if toUserID is present in db
      const isUserValid = await UserModel.findOne({_id:toUserId})
      if(!isUserValid) return res.status(400).json({err:'invalid user'});
     
      // check duplicate user in connection collection
      const isDuplicateConnection = await ConnectionModel.findOne({
        $or : [
            {fromUserId, toUserId},
            {fromUserId:toUserId, toUserId:fromUserId}
        ]
      })

      if(isDuplicateConnection) return res.status(400).json({err:"request already present"});

      const userConnection = ConnectionModel({
        fromUserId,
        toUserId,
        status
      })

      userConnection.save();
      res.status(200).json({message:`you ${status} ${isUserValid.name}`})
    } 

    catch(err) {
        console.log(err);
        res.status(400).send(`err:${err.message}`)
    }
})

// accept or reject the request
routes.patch('/connection/review/:status/:id', authorizedUser, async (req,res) => {
  try{
    const user = req.user;
    const {status,id} = req.params;
    
    // checks the valid status
    const validStatus = ['accepted','rejected'];
    if(!validStatus.includes(status)) return res.json({err:'invalid status'});

    const isValidUserData = await ConnectionModel.findOne({_id:id,toUserId:user._id,status:'like'});
    if(!isValidUserData) return res.json({err:'invalid request!!'});
    isValidUserData.status = 'accepted'
    await isValidUserData.save();
    res.status(200).json({message:'request accepted successfully'})
  }

  catch(err) {
    console.log(err);
    res.status(400).json({err:err.message});
  }
})

module.exports = routes 