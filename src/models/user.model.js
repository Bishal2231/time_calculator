import mongoose,{Schema} from "mongoose";
const userSchema=new Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        unique:true
    },avatar:{
        type:String
       
    },
    DOB:{
        type:String
    }
    ,post:{
        type:mongoose.Types.ObjectId,
        ref:"Time"
    }
},{timestamps:true})
export const User=mongoose.model("User",userSchema)