const express = require('express');
const requestRouter = express.Router();
const User = require("../model/user");
const {userAuth} = require("../../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req,res)=>{
    const user = req.user.firstName;
    res.send(user+" has send a connection request");
});

module.exports = requestRouter;