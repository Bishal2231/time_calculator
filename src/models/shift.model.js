import mongoose,{Schema} from "mongoose"

const shiftSchema=new Schema({
shiftDate:{
type:String,
required:true,
default:null
},
shiftTime:{
    type:String,
    required:true,
    default:null

},
endTime:{
    type:String,
    required:true

}
,owner:{
    type:mongoose.Types.ObjectId,
    ref:"User"
}

},{timestamps:true})

export const Shift=mongoose.model("Shift",shiftSchema)
