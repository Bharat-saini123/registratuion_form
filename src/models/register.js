require('dotenv').config();
const mongoose=require("mongoose");
const validator=require("validator")
const bcrypt=require("bcrypt");
const jsonwebtoken =require("jsonwebtoken")
const employeSchema=new mongoose.Schema({


    firstname:{
        type:String,
        required:[true,"bhai name nhi likha"],
        trim:true,
        minLength:3,

    },
    lastname:{
        type:String,
        required:[true,"bhai name nhi likha"],
        trim:true,
        minLength:3,
    },
    email:{
        type:String,
        required:[true,"bhai email nhi likha"],
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ("your email is not valid")
            }
        }
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
        minLength:10,
        maxLength:15,
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    confirmpassword:{
        type:String,
        required:true,
        unique:true,
    },
    tokens:[
        {
    token:{
        type:String,
        required:true,
       
    }

        }
    ]

})




employeSchema.methods.generateToken=async function(request,response){
    try{
    const token= jsonwebtoken.sign({_id:this._id.toString()},process.env.my_secret_key)
this.tokens= this.tokens.concat({token:token});
await this.save();
return token;

    }catch(error){
        response.status(404).send(error)
    }



}

 employeSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        this.confirmpassword=await bcrypt.hash(this.confirmpassword,10);
    }
 



next();

 })





const Register=new mongoose.model("studentregister",employeSchema);

module.exports=Register;