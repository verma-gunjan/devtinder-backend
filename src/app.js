const express = require("express");
const connectDB = require("../config/database");
const app = express();
const User = require("./model/user")
const {validateSignupData} = require("./utils/validation");
const bcrypt = require('bcrypt');
// const session = require('express-session');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("../middlewares/auth");

// handle and process the json data, reads the json data and convert it to js object
app.use(express.json())
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req,res) =>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            // creating json web token
            const token = await jwt.sign({_id: user._id}, "DevTinder$123", {expiresIn: "1d"});
            // sending the token to the browser
            res.cookie("token", token);
            console.log(token);
            res.send("Login Successfully");
        }else{
            res.status(401).send("Invalid credentials");
        }

    } catch(err){
        res.status(400).send("Error:" + err.message);
    }
});

app.get("/profile",userAuth, async (req, res) =>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(404).send("Error:" + err);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req,res)=>{
    const user = req.user.firstName;
    res.send(user+" has send a connection request");
});
connectDB().then(()=>{
    console.log("database is connected");
    app.listen(3000,()=>{
        console.log("server is running");
    })
}).catch(err =>{
    console.log("database cannot be connected");
});