const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30,
    },
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 4,
        maxLength: 30,
        trim: true,
    },
    lastName: {
        type: String,
        lowercase: true,
        minLength: 4,
        maxLength: 30,
        trim: true
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+value);
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password"+value);
            }
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18,
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        validate(value){
           if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
           }
        },
    },
    profilePictureUrl: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url"+value);
            }
        }
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
    },
    interest:{
        type: [String],
    },
    lookingFor: {
        type: String,
        lowercase: true,
        validate(value){
            if(!["friendship", "relationship", "casual"].includes(value)){
                throw new Error("Data is not valid");
            }
        }
    },
    location: {
        type: [String],
        lowercase: true,
        validate(value){
            if(value.length > 5){
                    throw new Error("cannot add more than five cities!");
            }
        }
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);