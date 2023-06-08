const jsonwebtoken=require("jsonwebtoken");
const Register=require("../models/register.js");


const auth=async(request,response,next)=>{

    try{
const token=request.cookies.logincookie;
const verfiUser=jsonwebtoken.verify(token,process.env.my_secret_key)
// console.log(verfiUser);

const user=await Register.findOne({_id:verfiUser._id})
// console.log(user)

request.token=token;
request.user=user;
next();
    }catch(error){
        response.status(404).send(error)
    }



}


module.exports=auth;