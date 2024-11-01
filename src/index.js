import express from "express"

import ejs from "ejs" 
import path from "path"
import { DBCONNECT } from "./db/db.js"
import dotenv from "dotenv"
import {handlerUserSignup,handleUserLogin,handleUserLogout,handlesendData,handleShiftSendData,handleCalculatorData} from "./controllers/user.controller.js"
import {isuserlogin,userlogged} from './middleware/usercheck.middleware.js'
import { handleUploadTime } from "./controllers/time.controller.js"
import {upload} from "./middleware/multer.middleware.js"
import cookieParser from "cookie-parser"
import cors from 'cors'
import { User } from "./models/user.model.js"
import { Time } from "./models/timetrakker.model.js"
import { Calculator } from "./models/calculator.model.js"
import { Shift } from "./models/shift.model.js"
const app=express()
dotenv.config()
 const port=process.env.PORT||3000
//  const baseUrl = `http://localhost:${port}`;
// 
app.use(express.urlencoded({extended:true}))

app.use(express.json()); 
app.use(cookieParser())
app.use(cors())
app.set("view engine","ejs")
app.set("views",path.resolve('views'))

app.use(express.static('public'))
// 

DBCONNECT()
.then(
    ()=>{
        app.listen(port,()=>{
            console.log("conntctipm estab;ish")
        })
        
    }
)
.catch((err)=>{
    throw new Error("error db con at index.js")
    
})






 app.get('/',userlogged,(req,res)=>{
     
    const user=req.user;
    if(user){ 
        res.render('index.ejs',{user,port})  
    }else{
        res.render('index.ejs',{user:null,port:null});
    }
   
})

app.get('/profile/:id',isuserlogin,userlogged,async (req,res)=>{

    const userId=req.params.id
   const user=await User.findById(userId)
   if(user){
    return res.render("profile.ejs",{user:user})

   }
   if(!user){
    console.log("usr doesnot exit")
    return res.render("profile.ejs",{user:null})
   
   }
   
})

app.get('/calculator',userlogged,(req,res)=>{
    const user=req.user
    if(user){
       return res.render("calculator.ejs",{user:user})

    }else{
      return  res.render("calculator.ejs",{user:null})
    }
})
app.get('/shift',userlogged,(req,res)=>{
    const user=req.user
    if(user){
       return res.render("shifts.ejs",{user:user})

    }else{
     return   res.render("shifts.ejs",{user:null})
    }
    
})
app.get('/shift/histroy/:id',isuserlogin,userlogged,async(req,res)=>{
    const user=req.user
    const userId=req.params.id

    const shifts=await Shift.find({owner:userId}).populate('owner').sort({createdat:-1})
    if(!(shifts.length===0)){
        return res.render("shiftHistroy.ejs",{user,shifts})

    }else{
        const error={
            heading:"sorry" ,
            paragraph:" NO shift user data at a moments" 
        }

        return res.render("errorM.ejs",{error})
      
    }

})
app.get('/login',(req,res)=>{
    
    res.render("login.ejs",{error:null})
})
app.get('/signup',(req,res)=>{

    res.render("signup.ejs",{error:null})
})

app.get('/all',(req,res)=>{
    res.render("calculator.ejs")
})
app.get('/timehistory/:id',isuserlogin,userlogged,async(req,res)=>{
    const userId=req.params.id
    // const user=await User.find({_id:userId})
    const user=req.user?req.user:null
    if(user){

   
    const texts=await Time.find({owner:userId}).populate('owner').sort({ createdAt: -1 });


    if(!(texts.length===0)){   
        return res.render("timetracker.ejs",{texts,user})
    }else{
        const error={
            heading:"sorry " ,
            paragraph:" No user time history data" 
        }

        return res.render("errorM.ejs",{error})
        
    }
}
else{
    return res.render("error.ejs", { message: "An error occurred while fetching time entries. no user found" });
}

})
app.get('/calculator/history/:id',isuserlogin,userlogged,async(req,res)=>{
    const userId=req.params.id
    const user=req.user

    const userexits=await User.findById(userId)
    if(userexits){

        
        const data=await Calculator.find({owner:userId}).sort({createdat:-1})
        if(!(data.length===0)){
            return res.render("calculatorHistory.ejs",{data,user})

        }else{
            const error={
                heading:"sorry" ,
                paragraph:" No user calculator history data" 
            }
    
            return res.render("errorM.ejs",{error})
        }
        // last timr i did this  26 oct,6:49




    }
    else{
        return res.render("error.ejs")
    }
})
// post

// app.get('/timetracker/histroy/:id',async(req,res)=>{
//     res.render("timetrackker.ejs",{data:null})
// })
app.post('/home/signup',upload.single('avatar'),handlerUserSignup)
app.post('/home/login',handleUserLogin) 
app.post('/logout',isuserlogin,userlogged,isuserlogin,handleUserLogout)
app.post('/sendData',isuserlogin,userlogged,handlesendData)

app.post('/shiftSendDate',isuserlogin,userlogged,handleShiftSendData)

app.post('/calculator',isuserlogin,userlogged,handleCalculatorData)




// 
















