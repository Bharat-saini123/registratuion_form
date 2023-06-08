const mongoose=require("mongoose");


const totalFunc=async()=>{
    await mongoose.connect(process.env.secret_connection)



}
totalFunc().then(()=>{


    console.log("server start hai")
}).catch(()=>{

    console.log("tumse na ho payega")
})