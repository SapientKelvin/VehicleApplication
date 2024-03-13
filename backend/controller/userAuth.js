const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();
const User = require("../model/authSchema");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Route :- 1
// Method :- POST
// URL :- http://localhost:5000/api/auth/singup
// Description :- Register New User And Store SingUp Data Into DataBase In Auth Model (auths collection )
const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userEmail = await User.findOne({ email: email });

    // Email Is Unique
    if (userEmail) {
      return res.status(403).json({ message: "User Email Is Already Exists", status: false });
    }

    // Salt Is Give Security From Rainbow Table
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    // Store The SingUp Data Into DataBase And Also Store In Auth Model (auths collection)
    // We Can Use new Auth() And .save() Method
    const user = await User.create({
      email: email,
      password: securePassword,
    });

    // If User Is Not Created Then This Response We Will Get
    if (!user) {
      return res.status(400).json({  message: "Something Went Wrong, User Is Not Created", status: false, });
    }

    // This Data Convert Into JWT Token And We Will Store In req
    const token = {
      user: {
        _id: user._id,
        email: user.email,
      },
    };

    // Create JWT Token For Auth
    const jwtToken = jwt.sign(token, jwtSecretKey);

    // If All Condition Is True Then We Will Get This Data
    res.json({ user: user, authToken: jwtToken, status: true });
  } catch (err) {
    // res.json({
    //   error: err,
    //   data: "Server Error, User SingUp Failed",
    //   status: false,
    // });
    // console.log("Error From Catch:",err)
    next(createError.InternalServerError("Internal Server Error"));
  }
};

// Route :- 2
// Method :- POST
// URL :- http://localhost:5000/api/auth/login
// Description :- Login Existing User And Store SingIn( Login ) Data Into DataBase In Auth Model (auths collection )
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User From DataBase Using Email Field Because Email Is Unique
    const user = await User.findOne({ email: email });

    // If User Is Not Found Or Not Exists In DataBase
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials, User Not Found", status: false });
    }

    // Bcrypt Always Returns True Or False && If req.body.password And Stored Password Are Match Then Returns True
    const checkPassword = await bcrypt.compare(password, user.password);

    // If Password Is Wrong Means Not True
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid Credentials", status: false });
    }

    // If All Condition Are True Then Generate JWT Token
    // Note :- Always Login And SingUp Token Will Be Same
    // That's Why We Write Same Token Code As SingUp
    const token = {
      user: {
        _id: user._id,
        email: user.email,
      },
    };

    // Generate JWT Token Same Code As SingUp
    const jwtToken = jwt.sign(token, jwtSecretKey);

    res.json({ user: user, authToken: jwtToken, status: true });
  } catch (err) {
    // res.json({
    //   error: err,
    //   data: "Server Error, User LogIn Failed",
    //   status: false,
    // });
    // console.log("Error From Catch:",err)
    next(createError.InternalServerError("Internal Server Error"));
  }
};

// Route :-3
// Method :- GET
// URL :- http://localhost:5000/api/auth/getuser
// Description :- Get Only LogIn Or SingUp User Details From The DataBase Using Middleware
const getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "Invalid Token, User Not Found", status: false });
    }
    res.json({ user: user, status: true });
  } catch (err) {
    // console.log("Error From Catch:",err)
    next(createError.InternalServerError("Internal Server Error"));
  }
};

module.exports = { signUp, signIn, getUser };
