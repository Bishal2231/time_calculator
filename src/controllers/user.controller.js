import { asynchandler } from "../utils/asynchandler.js"
import {User} from "../models/user.model.js"
import {v4 as uuidv4} from "uuid"
import { setUser } from "../utils/cokkie.js"
import {uploadoncloudinary} from "../utils/uploadoncloudinary.js"
import { Time } from "../models/timetrakker.model.js"
import {Shift} from "../models/shift.model.js"
import {Calculator} from "../models/calculator.model.js"
    // import { Text } from "../models/text.js"
    // import {Question} from "../models/contact.model.js"


    const handlerUserSignup = asynchandler(async (req, res, next) => {
        try {
            const { name, email, password, address,  DOB } = req.body;
            
            // Handle file uploads
            // const avatarPath = req.files && req.files['avatar'] ? req.files['avatar'][0].path : null; =req
          
            const avatar=req.file
            const avatarPath=avatar.path

    
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
                    name:"login",
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
            
      
    
            const avatarUrl=avatarlink?.url
      
            const user=await User.create({
                name,
                email,
                password,
                avatar:avatarUrl,
       
                address,
  
                DOB
      
            })


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
     
        const user=await User.findOne({ email })
        if(!user){
            const error = {
                heading: "User not found",
                paragraph: "We encountered that there is no user ,try creating a new one",
                name:"login",
                link:"/login"
            };

            return res.render("errorM.ejs", { error });

            
        }

       const userpass= await user.isPasswordCorrect(password)
       if(userpass){
      

            const sesionid=uuidv4();
            setUser(sesionid,user)
            res.cookie("userid",sesionid,{
                httpOnly:true,
                secure:true
               })
            res.render("index.ejs",{user:user})
            

        
       }else{
        const error = {
            heading: "User not found",
            paragraph: "We encountered that there is no user ,try creating a new one",
            name:"login",
            link:"/login"
        };

        return res.render("errorM.ejs", { error });
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
   
        



            const data=req.body;
         
            if(data.totalEarnings &&data.totalHours){

               const timehis=await Time.create({
                startclock:data.startclock?data.startclock:null,
                endclock:data.endclock?data.endclock:null,
                totalearning:data.totalEarnings,
                owner:user?user._id:null,
                totalhour:data.totalHours
               })
        
                res.status(200).json({ message: "success", data: data });

            }
            else{
                res.status(404).json({ message: "failure", data: null });

            }
        })
  const handleShiftSendData=asynchandler(async(req,res)=>{
        const data=req.body
        //   shiftDate,shiftTime,endTime
 
        const user=req.user

        const shift=await Shift.create({
            shiftDate:data.shiftDate,
            shiftTime:data.shiftTime,
            endTime:data.endTime,
            owner:user?user._id:null

        })

       
            if(shift){
                return res.status(200).json({message:"success",data:shift})
            }else{
                return res.status(400).json({message:"error occured"})
        }

})

  const handleCalculatorData=asynchandler(async(req,res)=>{

     const data=req.body
     const user=req.user
     
     const calculatorCreate=await Calculator.create({
        hoursWorked:data.hoursWorked,
        hourlyRate:data.hourlyRate,
        totalWage:data.totalWage,
        owner:user?user._id:null
     })

if(calculatorCreate){
    return res.status(200).json({message:"Success",data:calculatorCreate})

}
else{
    return res.status(400).json({message:"Failed"})

}



})

    export {handlerUserSignup,handleUserLogin,handleUserLogout,handlesendData,handleShiftSendData,handleCalculatorData}