import mongoose,{Schema} from "mongoose"

const timetrakkerSchema=new Schema({
startclock:{
type:String,
required:true,
default:null
},
endclock:{
    type:String,
    required:true,
    default:null

},
totalearning:{
    type:Number,
    required:true

},totalhour:{
    type:String,
    required:true
}
,owner:{
    type:mongoose.Types.ObjectId,
    ref:"User"
}

},{timestamps:true})

export const Time=mongoose.model("Time",timetrakkerSchema)
