import { asynchandler } from "../utils/asynchandler.js"
import {User} from "../models/user.model.js"
import {v4 as uuidv4} from "uuid"
import { setUser } from "../utils/cokkie.js"
import {uploadoncloudinary} from "../utils/uploadoncloudinary.js"
import { Time } from "../models/timetrakker.model.js"
    // import { Text } from "../models/text.js"
    // import {Question} from "../models/contact.model.js"


    const handlerUserSignup = asynchandler(async (req, res, next) => {
        try {
            const { name, email, password, address,  DOB } = req.body;
            
            // Handle file uploads
            // const avatarPath = req.files && req.files['avatar'] ? req.files['avatar'][0].path : null; =req
            console.log("req.body",req.body)
            const avatar=req.file
            const avatarPath=avatar.path
    console.log("avatar",avatarPath)
    
            // Check if the user is already registered
            const alreadyRegisterUser = await User.findOne({
                $or: [
                    { name: name },
                    { email: email }
                ]
            });
    
            if (alreadyRegisterUser) {
                const error = {
                    heading: "User already has an account",
                    paragraph: "We encountered that you already have an account. Try login",
                    name:login,
                    link:"/login"
                };
    
                return res.render("errorM.ejs", { error });
            }
    
    
        if(!avatarPath){
            const error={
                heading:"Avatar is Required" ,
                paragraph:" Please fill the form correctly and submit again" 
            }
            return res.render("errorM.ejs",{error})
           
            }
            // const avatarpath=avatar?.path
            const avatarlink= await uploadoncloudinary(avatarPath)
            
          console.log("avatarlink",avatarlink)

    
            const avatarUrl=avatarlink?.url
            console.log("avatarUrl",avatarUrl)
            const user=await User.create({
                name,
                email,
                password,
                avatar:avatarUrl,
       
                address,
  
                DOB
      
            })
            console.log("user",user)

            if(!user){
                // const error="no such user try signin"
                // res.render('login.ejs',{error})
    
                const error={
                    heading:"internal server error" ,
                    paragraph:"" 
                }
               
              
            }
          
            return res.redirect("/")
    
        }
        catch(err){
            const error={
                heading:err ,
                paragraph:" some thing went wrong" 
            }
    
            return res.render("errorM.ejs",{error:err})
        }
    })
    const handleUserLogin=asynchandler(async(req,res)=>{
        const {email,password}=req.body
        console.log(req.body) 
        const user=await User.findOne({ email })
        if(!user){
            throw new Error(404,"user not found")
        }
        if(user && (user.password===password)){

            const sesionid=uuidv4();
            setUser(sesionid,user)
            res.cookie("userid",sesionid,{
                httpOnly:true,
                secure:true
               })
            res.render("index.ejs",{user:user})
            

        }




    })

    const handleUserLogout=asynchandler(async(req,res)=>{

        const user=req.user;
        try {
            const options={
                httpOnly:true,
                secure:true,
                sameSite: 'strict',
                path: '/',
            }
            res.clearCookie("userid",options);
            return res.redirect('/')
            
        } catch (error) {
            console.log(error);
        }

      
    })
 const handlesendData=asynchandler(async(req,res)=>{
        const user=req.user?req.user:null  //need his wity ternary operator
        console.log(user)
        // if(!user){
        //   return res.render("error.ejs")
        // }



            const data=req.body;
            console.log("backend data  ",data);
            if(data.totalEarnings &&data.totalHours){

               const timehis=await Time.create({
                startclock:data.startclock?data.startclock:null,
                endclock:data.endclock?data.endclock:null,
                totalearning:data.totalEarnings,
                owner:user?user._id:null,
                totalhour:data.totalHours
               })
               console.log(timehis)
                res.status(200).json({ message: "success", data: data });

            }
            else{
                res.status(404).json({ message: "failure", data: null });

            }
        })

    
    
    export {handlerUserSignup,handleUserLogin,handleUserLogout,handlesendData}