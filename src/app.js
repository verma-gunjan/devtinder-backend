const express = require("express");
const connectDB = require("../config/database");
const app = express();
const User = require("./model/user")

// handle and process the json data, reads the json data and convert it to js object
app.use(express.json())

app.post("/signup", async (req, res) => {
    try {
        // First, check if email already exists
        const emailExists = await User.findOne({ emailId: req.body.emailId });
        if (emailExists) {
            return res.status(400).send('Email already exists');
        }
        const data = req.body;
        const USER_PARAMS = ["userName", "firstName", "lastName", "emailId", "password", "age", "gender", "profilePictureUrl", "additionalPictures", "about", "skills"]
        const isCreateAllowed = Object.keys(data).every((k)=>
            USER_PARAMS.includes(k)
        );
        if(!isCreateAllowed){
            throw new Error("Cannot signup");
        }
        // If not, create and save new user
        const user = new User(data);
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
});

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