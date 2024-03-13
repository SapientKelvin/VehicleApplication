const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const db = require("./db/db")
db()

// Get All The .env Varriable
dotenv.config()

const port = process.env.PORT || 5000

// Creating Express App
const app = express()
 
// app.use() Is Give Middleware To Whole App
// This Middleware Is Use When We Works With req.body() 
app.use(express.json())

// Server Use Cors
app.use(cors())

// Error Handling Using Epress App Middleware And Also Use npm http-errors Package 
app.use(async (req,res,next)=>{
    next()
})

// Error Handling Using Exress App And Show The Error
app.use((err,req,res,next)=>{
    res.status(err.status)
    res.json({ message:err.message, status:false })
})

// All The Route Are Working
// For Authentication, Forgot Password, And vehicleData
app.use("/api/auth/", require("./routes/authRoute"))
app.use("/api/data/", require("./routes/vehicleDataRoute"))
app.use("/api/forgot/", require("./routes/forgotPassRoute"))

app.get("/",(req, res)=>{
    res.json({data:"Server Is On",status:true})
})

const server = app.listen(port, (err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(`Server Is Running On http://localhost:${port}....`)
    }
})