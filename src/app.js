const express = require("express");
const cors = require("cors");
const connectDB = require("../config/database");
const app = express();
const cookieParser = require("cookie-parser");

// handle and process the json data, reads the json data and convert it to js object
app.use(cors(
  {  origin: "http://localhost:5173",
    credentials: true,}
));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB().then(()=>{
    console.log("database is connected");
    app.listen(3000,()=>{
        console.log("server is running");
    })
}).catch(err =>{
    console.log("database cannot be connected");
});