const express = require('express');
const authRouter = express.Router();

const {validateSignupData} = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../model/user");
const {userAuth} = require("../../middlewares/auth");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const USER_SAFE_DATA = ["userName", "firstName", "lastName", "agr",
    "gender","profilePictureUrl", "additionalPictures", "about", "skills", "interest", "lookingFor","location"];

authRouter.post("/signup", async (req, res) => {
    try {
        data = req.body
        // validation of data
        validateSignupData(data);

        // First, check if email already exists
        const emailExists = await User.findOne({ emailId: data.emailId });
        if (emailExists) {
            return res.status(400).send('Email already exists');
        }
        // bcrypt the password
        const {password} = data;
        const passwordHash = await bcrypt.hash(password,10);

        // create a new user instance
        const user = new User({
           ...data,
            password: passwordHash});
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
});

authRouter.post("/login", async (req,res) =>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            // creating json web token
            const token = await user.getJWT();
            // sending the token to the browser
            res.cookie("token", token);
            res.json(
                {
                    message: "Login Successfull",
                    user: user,
                });
        }else{
            res.status(401).json({message: "Invalid credentials"});
        }

    } catch(err){
        res.status(400).json({message: err.message});
    }
});

authRouter.post("/logout", async (req, res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now())
    }).send("logout successfylly");
});

module.exports = authRouter;