import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
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

userSchema.pre("save",async function(next) {
if(!this.isModified("password")) return next();

this.password = await bcrypt.hash(this.password, 10)
next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User=mongoose.model("User",userSchema)