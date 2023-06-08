
const express=require("express");
const dotenv=require("dotenv")
dotenv.config({path:"../.env"})
const path=require("path");
const bcrypt=require("bcrypt")
const port=process.env.PORT||3000;
const hbs=require("hbs");
require("./db/connection.js");
const auth=require("./middleware/auth.js")
const cookieParser=require("cookie-parser");
// const jsonwebtoken=require("jsonwebtoken")

const Register=require("./models/register.js");
// const { error } = require("console");

const app=express();
// console.log(process.env.secret_connection)
// console.log(process.env.my_secret_key)
// console.log(path.join(__dirname,"../public"))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))


app.set("view engine","hbs");

hbs.registerPartials(path.join(__dirname,"./partials"))
// console.log(path.join(__dirname,"./partials"))

app.get("/",(request,response)=>{
    response.render("index.hbs")


})

app.get("/secret",auth,(request,response)=>{
    // console.log(`this is my  ${request.cookies.saini}`);
    response.render("secret.hbs")



})
app.get("/logout",auth,async(request,response)=>{
   
   console.log( request.user)
response.clearCookie("logincookie");
  await request.user.save()
response.render("login.hbs")
   }
  )

app.use(express.static(path.join(__dirname,"../public")))

    app.get("/",(request,response)=>{
        response.send("home page")


    })



    app.get("/login",(request,response)=>{
        response.render("login.hbs")
    
    
    })




    app.get("/register",(request,response)=>{
        response.render("register.hbs")


    })




    // create a new user in your data base.
    app.post("/register",async(request,response)=>{
        try{
const password=request.body.password;
const confirmpassword=request.body.confirmpassword;
if(password===confirmpassword){
    const employeRegister=new Register({
        firstname :request.body.firstname,
        lastname:request.body.lastname,
        email:request.body.email,
        phone:request.body.phone,
        password:request.body.password,
        confirmpassword:request.body.confirmpassword,
    })

    const token=await employeRegister.generateToken();
    // console.log(token)


    //cookies

    response.cookie("registercookie",token,{
        expires:new Date(Date.now()+600000),
        httpOnly:true,
    })
    // console.log(cookie)

    const user=await employeRegister.save();
    // console.log(user)
    response.status(202).render("index.hbs");
}

else{
    response.send("your password does not match")
}
        }catch(error){
            response.status(404).send(error)
        }


    })


    app.post("/login",async(request,response)=>{

        try{
            const email=request.body.email;
            const password=request.body.password;
            
         
            const useremail=await Register.findOne({email:email})
            // console.log(useremail.password)

            const checkPassword=await bcrypt.compare(password,useremail.password)
            const token=await useremail.generateToken();
    // console.log(token)
    response.cookie("logincookie",token,{
        expires:new Date(Date.now()+600000),
        httpOnly:true,
    })

          if(checkPassword){

             response.status(202).render("index.hbs")
          }
          else{
             response.status(404).send("invalid login")
          }
        }catch(error){
            response.status(404).send("invalid login")
        }

  

    
    
    })




    app.get("/register",(request,response)=>{
        response.send("register page")


    })


    app.get("*",(request,response)=>{
        response.render("error.hbs")


    })

    app.get("*",(request,response)=>{
        response.send("errror hai back kr le")


    })


    app.listen(port,"127.0.0.1",()=>{

        console.log(`servser run at port at ${port}`)
    })