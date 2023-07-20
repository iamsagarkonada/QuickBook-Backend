const mongoose=require('mongoose');

const mongoURI= "mongodb://127.0.0.1:27017/inotebook"
const connectMongo=()=>{
    mongoose.connect(mongoURI)
        console.log("Connect to mongo Sucessfully");
}
module.exports=connectMongo;