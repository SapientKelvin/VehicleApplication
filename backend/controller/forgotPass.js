const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();
const createError = require("http-errors");

const ForgotPass = require("../model/forgotPasswordSchems");
const User = require("../model/authSchema");

const myEmail = process.env.MY_EMAIL;
const myPassword = process.env.MY_EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: myEmail,
    pass: myPassword,
  },
});

// Route :- 1
// Method :- POST
// URL :- http://localhost:5000/api/forgot/mailotp
// Description :- This Route Is Used For Send OTP To LoggedIn User
const mailOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userEmail = await User.findOne({ email: email });
    // If User Is Not Register Means Not LoggedIn
    if (!userEmail) {
      return res.status(404).json({ message: "User Not Exists", status: false });
    }

    // Find Already Exists Email And Delete Thier Data From DataBase 
    const emailOTP = await ForgotPass.findOne({email:email})
    if(emailOTP){
      await ForgotPass.findOneAndDelete({email : emailOTP.email})
    }

    let otp = Math.floor(Math.random() * 1000000);
    if (otp < 100000) {
      otp *= 10;
    }

    const sendedMail = await transporter.sendMail({
      from: myEmail,
      to: userEmail.email,
      subject: "OTP For Forgot Password",
      text: `Your OTP Is ${otp}`,
    });

    console.log("Mail Has Been Sended Successfully", sendedMail);

    // First Time Email For OTP
    const storeOTP = await ForgotPass.create({
      email: userEmail.email,
      otp: otp,
    });

    if (!storeOTP) {
      return res.status(400).json({ message: "Something Went Wrong, OTP Not Store", status: false, });
    }

    res.json({ data: storeOTP, status: true });
  } 
  catch (err) {
    console.log("Error From Catch ", err);
    next(createError.InternalServerError("Internal Server Error"))
  }
};

// Route :- 2
// Method :- POST
// URL :- http://localhost:5000/api/forgot/verifyotp
// Description :- This Route Is Used For Verifing The OTP And Reset Password
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const forgotData = await ForgotPass.findOne({ email: email });

    if (!forgotData) {
      return res.status(404).json({ message: "Invalid Credentials, OTP Not Found", status: false });
    }

    // Check Input OTP Is Match Or Not
    if (Number(otp) !== Number(forgotData.otp)) {
      return res.status(400).json({ message: "Invalid OTP", status: false });
    }

    res.json({ data:"Verification Done", verify: true, status: true });
  } 
  catch (err) {
    console.log("This Is Error From Catch Side ", err);
    next(createError.InternalServerError("Internal Server Error"))
  }
};

// Route :- 3
// Method :- PUT
// URL :- http://localhost:5000/api/forgot/reset
// Description :- This Route Is Update User's New Password
const resetOTP = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const userEmail = await User.findOne({ email: email });

    // If User Is Not Exist In DataBase
    if (!userEmail) {
      return res.status(404).json({ message: "Invalid Credentials", status: false });
    }

    const salt = await bcrypt.genSalt(10);
    const secureNewPassword = await bcrypt.hash(newPassword, salt);

    let updateUser = {
      email: userEmail.email,
      password: secureNewPassword,
    };

    const passwordReset = await User.findOneAndUpdate( { email: userEmail.email }, { $set: updateUser }, { new: true } );

    // If User Password Not Update
    if (!passwordReset) {
      return res.status(400).json({ message: "Something Went Wrong, Password Is Not Update", status: false, });
    }

    res.json({ data: passwordReset, status: true });
  }
  catch (err) {
    console.log("This Error From Catch Side ", err);
    next(createError.InternalServerError("Internal Server Error"))
  }
};

module.exports = { mailOTP, verifyOTP, resetOTP };
