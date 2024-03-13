const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwtSecretKey = process.env.JWT_SECRET_KEY

const authTokenWare = (req,res,next)=>{
    try{
        // Get authToken From The Header
        const authToken = req.header("authToken")

        // If authToken Is Not Set In Header
        if(!authToken){
            return res.json({ message:"Token Not Found In Header", status:false })
        }

        const userToken = jwt.verify(authToken, jwtSecretKey)

        // If Token Is Invalid And Not Get Data From It
        if(!userToken){
            return res.json({ message:"Invalid/Expired Token", status:false })
        }

        // If All The Condition Are Resolve The
        req.user = userToken.user
        next()
    }
    catch(err){
        res.json({ error:err, data:"Server Error", status:false })
    }
}

module.exports = authTokenWare