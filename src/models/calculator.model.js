import mongoose,{Schema} from "mongoose";
const calculatorSchema=new Schema({

    hoursWorked:{
      type:Number

    },hourlyRate:{
        type:Number
    }
    ,totalWage:{
        type:String
    },owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})
export const Calculator=mongoose.model("Calculator",calculatorSchema)

