const express = require("express");
const connectDB = require("../config/database");
const app = express();
const User = require("./model/user")
const {validateSignupData} = require("./utils/validation");
const bcrypt = require('bcrypt');
// const session = require('express-session');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
            const token = await jwt.sign({_id: user._id}, "DevTinder$123");
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

app.get("/profile", async (req, res) =>{
    try{
        // fetching token from cookies
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
           res.status(401).send("Not logged in");
        }
        // decoding the token
        const decode = jwt.verify(token, "DevTinder$123");
        const userId = decode._id;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).send("user not found");
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(404).send("Error:" + err);
    }
})

app.get("/user", async (req, res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.find({emailId: userEmail});
        if(!user){
            res.status(404).send("user not found");
        }else {
            res.send(user); 
        }
    } catch(err){
        res.status(400).send("something went wrong");
    }
});

app.delete("/user/:userId", async (req, res)=>{
    const userId = req.params.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    } catch(err){
        res.status(400).send("something went wrong");
    }
})

app.patch("/user/:userId",async (req, res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const USER_PARAMS = [
           "firstName", "lastName", "age", "gender", "profilePictureUrl", "additionalPictures", "about", "skills", "password"
         ]
         const isUpdateAllowed = Object.keys(data).every((k)=>
             USER_PARAMS.includes(k)
         );

         if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10!");
         }
     
         if(!isUpdateAllowed){
             throw new Error("Update Not Allowed");
         }
        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("user updated successfully");
    }catch(err){
        res.status(400).send("something went wrong" + err.message);
    }
});

app.get("/feed", async (req, res)=>{
    try{
        // passing empty obj will give all users list
        const users = await User.find({});
        res.send(users);
    } catch(err){
        res.status(400).send("something went wrong");
    }
});

connectDB().then(()=>{
    console.log("database is connected");
    app.listen(3000,()=>{
        console.log("server is running");
    })
}).catch(err =>{
    console.log("database cannot be connected");
});