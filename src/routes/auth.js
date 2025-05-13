const express = require('express');
const authRouter = express.Router();

const {validateSignupData} = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../model/user");
const {userAuth} = require("../../middlewares/auth");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            // creating json web token
            const token = await user.getJWT();
            // sending the token to the browser
            res.cookie("token", token);
            res.send("Login Successfully");
        }else{
            res.status(401).send("Invalid credentials");
        }

    } catch(err){
        res.status(400).send("Error:" + err.message);
    }
});

module.exports = authRouter;