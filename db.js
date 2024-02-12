const mongoose = require('mongoose');
const uri = "mongodb://127.0.0.1:27017/ComplainPortal";
mongoose.connect(uri);

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
});
const Users = mongoose.model("User",userSchema);

const complainSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    topics:[String],
    complainStatus:{
        type:String,
        default:"open"
    },
    canBeAnsweredBy:{
        type:[String],
        default:["admin"]
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required:true
    }
})
const Complains = mongoose.model("Complains", complainSchema);

const repliySchema = mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    complainId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Complains',
        required:true
    }
})
const Replies = mongoose.model("Replies",repliySchema);

module.exports = {
    Complains,
    Users,
    Replies
}
