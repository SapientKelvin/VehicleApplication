const express = require("express")
const {mailOTP, verifyOTP, resetOTP} = require("../controller/forgotPass")

const router = express.Router()

// Route :- 1
// Method :- POST
// URL :- http://localhost:5000/api/forgot/mailotp
// Description :- This Route Is Used For Send OTP To LoggedIn User
router.post("/mailotp", mailOTP)

// Route :- 2
// Method :- POST
// URL :- http://localhost:5000/api/forgot/verifyotp
// Description :- This Route Is Used For Verifing The OTP And Reset Password
router.post("/verifyotp", verifyOTP)

// Route :- 3
// Method :- PUT
// URL :- http://localhost:5000/api/forgot/reset
// Description :- This Route Is Update User's New Password 
router.put("/reset", resetOTP)

module.exports = router