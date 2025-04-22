const express = require("express");
const connectDB = require("../config/database");
const app = express();
const User = require("./model/user")

// handle and process the json data, reads the json data and convert it to js object
app.use(express.json())

app.post("/signup",async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("user added successfully");
    } catch(err){
        res.status(400).send("error saving the user",err);
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