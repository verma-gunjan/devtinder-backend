const express = require("express");
require("../config/database");
const app = express();
app.listen(3000,()=>{
    console.log("server is running");
})