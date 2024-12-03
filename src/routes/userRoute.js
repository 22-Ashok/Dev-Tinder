const express = require("express");
const routes = express.Router();
const authorizedUser = require("../middleware/authorize")
const ConnectionModel = require('../models/connectionSchema')
const UserModel = require('../models/userSchema')

// see all request
routes.get('/user/allrequestlist', authorizedUser, async (req,res) => {
    try{
      const user = req.user;
      const allRequest = await ConnectionModel.find({
        toUserId:user._id,
        status:'like'
      })
      .populate('fromUserId', 'name gender' )
      .populate('toUserId', 'name gender' )

      res.status(200).json({request:allRequest});
    }

    catch(err) {
      res.status(400).json({err:err.message});
    }
})

// see all connections 
routes.get('/user/connection', authorizedUser, async (req,res) => {
    try{
      const user = req.user;
      const connections = await ConnectionModel.find({
        $or:[
          {fromUserId:user._id},
          {toUserId:user._id}
        ],
        status:'accepted'
      })
      .populate('fromUserId', 'name gender skills')
      .populate('toUserId', 'name gender skills')
     
      if(connections.length<1) return res.status(200).json({message:'friend not found'});
      //send the friend only
      const filterConnections = connections.map((friend) => {
        if(friend.toUserId.equals(user._id)) return friend.fromUserId
        return friend.toUserId;
      })
      res.status(200).send(filterConnections);
    }

    catch(err) {
      console.log(err)
      res.status(400).json({err:err.message})
    }
})

// feed 
routes.get('/feed', authorizedUser, async (req,res) => {
    try{
      const user = req.user;
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      
      limit = limit < 15 ? limit : 10;
      const skip = (page-1)*limit; 

        const connections = await ConnectionModel.find({
          $or:[
            {fromUserId:user._id},
            {toUserId:user._id}
          ]
        })

        const hideConnections = new Set();
        connections.forEach((connection) => {
          hideConnections.add(connection.fromUserId.toString());
          hideConnections.add(connection.toUserId.toString());
        })

       const mainFeed = await UserModel.find({
          _id: {$nin: Array.from(hideConnections)}
        })
        .select('id name skills DOB gender')
        .skip(skip)
        .limit(limit)
        
        res.status(200).send(mainFeed);
    }

    catch(err) {
      console.log(err);
      res.status(400).json({err:err.message})
    }
})

module.exports = routes 