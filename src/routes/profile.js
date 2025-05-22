const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');

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

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { currentPassword, newPassword } = req.body;

        if (await loggedInUser.validateNewPassword(newPassword)) {
            return res.status(400).send("New password and current password cannot be the same");
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = newPasswordHash;
        await loggedInUser.save();

        res.status(200).send("Password updated successfully");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});


module.exports = profileRouter;