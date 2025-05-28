const express = require("express");
const userRouter = express.Router();
const User = require("../model/user");
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
        .populate("toUserId",USER_SAFE_DATA );

        if(!connectionData.length){
            res.status(404).json({
                message: "no connections yet"
            })
        }
        const fromUserData = connectionData.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
            });
        res.status(200).json({
            message: "all connections",
            data: fromUserData
        })
    } catch (err){
        res.status(400).send(err.message);
    }
})

userRouter.get("/feed", userAuth, async (req, res) =>{
    try{
        loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;

        const connectionRequests = await connectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
        const users = await User.find({
          $and: [
           { _id: {$nin: Array.from(hideUsersFromFeed)}},
           { _id: {$ne: loggedInUser._id}}
        ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.status(200).json({
            data: users
        })
    } catch (err){
        console.error("Error in /feed route:", err);

        res.status(400).json({
            message: err.message
        });
    }
})

module.exports = userRouter;