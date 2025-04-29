const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
    },
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        required: true,
        validate(value){
           if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
           }
        },
    },
    profilePictureUrl: {
        type: String,
    },
    additionalPictures: {
        type: [String],
    },
    about: {
        type: String,
        default: "This is a default description of user",
    },
    skills: {
        type: [String],
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);