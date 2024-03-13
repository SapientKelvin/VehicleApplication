const express = require("express")
const router = express.Router()

router.get("/allData", (req,res)=>{
    res.json({msg:"Request From allData",status:true})
})

module.exports = router