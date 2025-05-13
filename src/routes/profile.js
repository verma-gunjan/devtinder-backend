const express = require('express');
const profileRouter = express.Router();

const User = require("../model/user");
const {userAuth} = require("../../middlewares/auth");

profileRouter.get("/profile",userAuth, async (req, res) =>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(404).send("Error:" + err);
    }
});

module.exports = profileRouter;