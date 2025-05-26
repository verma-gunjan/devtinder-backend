const express = require('express');
const requestRouter = express.Router();
const User = require("../model/user");
const {userAuth} = require("../../middlewares/auth");
const connectionRequest = require('../model/connectionRequest');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res)=>{
    try{
        const fromUserId = req.user._id;
        const status = req.params.status;
        const toUserId = req.params.toUserId;
        const statusChoice = ["interested","ignore"];

        if (!statusChoice.includes(status)){
            return res.status(400).json({
                message: "Invalid status type" + " " +status
            })
        }
        const toUser = await User.findById(toUserId);

        if(!toUser){
            res.status(404).json({
                message: "User not found"
            })
        }
        const existingRequest = await connectionRequest.findOne({
            // check vice versa condition in the mongo
            $or:[
                {fromUserId,toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if(existingRequest){
            return res.status(400).json({ 
                message: "Connection request already exists"
            });
        }

        const request = new connectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await request.save();
        res.status(200).json({
            message: "Conection request send successfully",
            data
        })
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

requestRouter.get("/requests", userAuth, async (req, res)=>{
    const loggedInUser = req.user;
    const myRequests = await connectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
    });
    if(!myRequests){
        return res.status(404).json({
            message: "no request found"
        })
    }
    res.status(200).json({
        data: myRequests
    });
})

requestRouter.get("/request/profile/view/:fromUserId", userAuth, async(req, res)=>{
    const fromUser = req.params.fromUserId;
    const fromUserData = await User.findOne({_id: fromUser});
    if(!fromUserData){
        return res.status(404).json({
            message: "no profile found"
        })
    }
    res.status(200).json({
        data: fromUserData,
    });
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        // validate status
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Status is invalid"
            })
        }

        const request = await connectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        if(!request){
            return res.send(404).json({
                message: "connection request not found",
            })
        }
        request.status = status;
        await request.save();
        res.send(202).json({
            message: "connection request is" + status,
            data: request
        })
        
    } catch(err){

    }
});

module.exports = requestRouter;