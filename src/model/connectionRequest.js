const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
         values: ["accepted","rejected","pending","interested","ignore"],
         message: `{VALUE} is incorrect status type`
        }
    }
},{
    timestamps: true,
    }
);

// compound index on from user id and to user id
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

// it will be call just before saving the record
connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;
    // check if fromuserid is same as touserid
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connect request to yourself");    }
    next();
});

module.exports = mongoose.model("connectionRequest",connectionRequestSchema);