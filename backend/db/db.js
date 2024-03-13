const mongoose = require("mongoose")
const {handleError} = mongoose
const dotenv = require("dotenv")
dotenv.config()

const url = process.env.MONGO_URL

const connectToDB = async ()=>{
    try{
        await mongoose.connect(url)
        console.log(`Mongoose Is Connecte With MongoDB DataBase....`)

        mongoose.connection.on("connected", ()=>{
            console.log("Mongoose Is Connection Is Established With MongoDB Atlas....")
        })

        mongoose.connection.on("error",(err)=>{
            console.log("Mongoose Connection Error....",err)
        })

        mongoose.connection.on("disconnected",()=>{
            console.log("Mongoose Is Disconnected With MongoDB Atlas....")
        })
    }
    catch(err){
        console.log("This Is DataBase Handle Error From Catch Block",err)
        handleError(err)
    }
}

module.exports = connectToDB