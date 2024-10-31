import mongoose from "mongoose" 
import dotenv from "dotenv"


dotenv.config()
const DBCONNECT= async()=>{
try {
    
    const connection =await mongoose.connect(`${process.env.DB_URL}/wageAnalyzer`)
} catch (error) {
    throw new Error("error at db connection ")
    
}




}
export {DBCONNECT}