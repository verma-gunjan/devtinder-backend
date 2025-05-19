const express = require('express');
const profileRouter = express.Router();

const User = require("../model/user");
const {userAuth} = require("../../middlewares/auth");
const { validateProfileData } = require('../utils/validation');

profileRouter.get("/profile/view",userAuth, async (req, res) =>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(404).send("Error:" + err);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
      if (!validateProfileData(req)) {
        return res.status(400).send("Invalid profile data");
      } 
      const loggedInUser = req.user;
      Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
      });
      await loggedInUser.save();
      return res.send("Profile updated successfully");
    } catch (err) {
      return res.status(500).send("Error: " + err.message);
    }
  }); 

module.exports = profileRouter;