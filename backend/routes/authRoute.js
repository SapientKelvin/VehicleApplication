const express = require("express")
const authTokenWare = require("../middleware/user")
const {signUp, signIn, getUser} = require("../controller/userAuth")

// Create Router
const router = express.Router()

// Route :- 1 
// Method :- POST
// URL :- http://localhost:5000/api/auth/signup
// Description :- Register New User And Store SingUp Data Into DataBase In Auth Model (auths collection ) 
router.post("/signup", signUp)

// Route :- 2
// Method :- POST
// URL :- http://localhost:5000/api/auth/login
// Description :- Login Existing User And Store SingIn( Login ) Data Into DataBase In Auth Model (auths collection )
router.post("/login", signIn)

// Route :-3
// Method :- GET
// URL :- http://localhost:5000/api/auth/getuser
// Description :- Get Only LogIn Or SingUp User Details From The DataBase Using Middleware 
router.get("/getuser", authTokenWare, getUser)

module.exports = router