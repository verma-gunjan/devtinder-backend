const mongoose = require('mongoose');
const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://vermagunjan9927:Gunjan%40111@cluster0.r15p0vr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
      );
};

connectDB().then(()=>{
    console.log("database is connected");
}).catch(err =>{
    console.log("database cannot be connected");
});