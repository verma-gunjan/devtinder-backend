const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../../middlewares/auth");
const connectionRequest = require("../model/connectionRequest");
const USER_SAFE_DATA = ["userName", "firstName", "lastName", "agr",
    "gender","profilePictureUrl", "additionalPictures", "about", "skills", "interest", "lookingFor","location"];
// get all pending request
userRouter.get("/requests", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        const myRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA );

        if(!myRequests.length){
            return res.status(404).json({
                message: "no request found"
            })
        }
        res.status(200).json({
            data: myRequests
        });
    } catch(err){
        res.status(404).send(err.message);
    }
});

userRouter.get("/connections", userAuth, async(req, res)=>{
    try{
        loggedInUser = req.user._id;
        connectionData = await connectionRequest.find({
            $or:[
                { toUserId: loggedInUser, status: "accepted"},
                { fromUserId: loggedInUser, status: "accepted"},
            ]
        })
        .populate("fromUserId",USER_SAFE_DATA )
        .populate("toUserId",USER_SAFE_DATA )
        if(!connectionData.length){
            res.status(404).json({
                message: "no connections yet"
            })
        }
        const fromUserData = connectionData.map(row => row.fromUserId);
        res.status(200).json({
            message: "all connections",
            data: fromUserData
        })
    } catch (err){
        res.status(400).send(err.message);
    }
})

module.exports = userRouter;