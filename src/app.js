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

        // If not, create and save new user
        const user = new User(req.body);
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

app.delete("/user", async (req, res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    } catch(err){
        res.status(400).send("something went wrong");
    }
})

app.patch("/user",async (req, res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
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