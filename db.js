const mongoose=require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongoURI= process.env.MONGO_CONNECT_URL
const connectMongo=async()=>{
    try {
        await mongoose.connect(mongoURI),
        console.log("Connect to mongo Server Sucessfully")
    }catch (error) {
        console.log("Connection Failed "+error)
    }
    } 
    
module.exports=connectMongo;