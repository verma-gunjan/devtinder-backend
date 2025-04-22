const mongoose = require('mongoose');
const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://vermagunjan9927:Gunjan%40111@cluster0.r15p0vr.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0"
      );
};

module.exports = connectDB;