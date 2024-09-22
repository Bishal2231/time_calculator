import express from "express"

import ejs from "ejs" 
import path from "path"
import { DBCONNECT } from "./db/db.js"
import dotenv from "dotenv"
import {handlerUserSignup,handleUserLogin,handleUserLogout,handlesendData} from "./controllers/user.controller.js"
import {isuserlogin,userlogged} from './middleware/usercheck.middleware.js'
import { handleUploadTime } from "./controllers/time.controller.js"
import {upload} from "./middleware/multer.middleware.js"
import cookieParser from "cookie-parser"
import cors from 'cors'
import { User } from "./models/user.model.js"
const app=express()
dotenv.config()
 const port=3007||3000
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
).catch((err)=>{
    throw new Error("error db con at index.js")
    
})






app.get('/',userlogged,(req,res)=>{
     
    const user=req.user;
        console.log(user);
    if(user){ 
        res.render('index.ejs',{user})  
    }else{
        res.render('index.ejs',{user:null});
    }
   
})

app.get('/profile/:id',async (req,res)=>{

    const userId=req.params.id
    console.log(userId)
   const user=await User.findById(userId)
   console.log(user)
   if(user){
    console.log("usr exit")
    return res.render("profile.ejs",{user:user})

   }
   if(!user){
    console.log("usr doesnot exit")
    return res.render("profile.ejs",{user:null})
   
   }
   
})

app.get('/calculator',(req,res)=>{

    res.render("calculator.ejs")
})
app.get('/shift',(req,res)=>{

    res.render("shifts.ejs")
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






// post
app.post('/home/signup',upload.single('avatar'),handlerUserSignup)
app.post('/home/login',handleUserLogin) 
app.post('/logout',userlogged,isuserlogin,handleUserLogout)
app.post('/sendData',userlogged,handlesendData)















