import {getUser} from "../utils/cokkie.js"

const isuserlogin=(req,res,next)=>{
    
    const userid=req.cookies.userid
    const user=getUser(userid)
    
    
    
    
    if(user){
    
        req.user=user
        return next()
    }
    // return res.redirect("/signup")
    return res.redirect('/')
 }

 const userlogged=(req,res,next)=>{
    
    const userid=req.cookies.userid
    const user=getUser(userid)
    
    console.log("user",user);
    
    
    if(user){
    
        req.user=user
        return next()
    }
    return next()
 }


 export {isuserlogin,userlogged}