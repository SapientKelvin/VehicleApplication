const mongoose = require("mongoose")
const {Schema} = mongoose

const forgotPassSchema = new Schema({
    email:{
        type:String,
        required: true
    },
    otp:{
        type: Number,
        required: true
    }
})

const ForgotPass = mongoose.model("ForgotPass", forgotPassSchema)

module.exports = ForgotPass