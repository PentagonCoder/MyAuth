import {asyncHandler} from '../utils/asyncHandler.js'
import User from '../model/user.model.js';
import crypto from "crypto";
import { sendEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import { request } from 'http';

const forgotPassword = asyncHandler ( async(req, res, ) => {
  const { email } = req.body;
  const resetToken = crypto.randomBytes(12).toString("hex");
  console.log(resetToken);

  const hashedToken = await crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

  const user = await User.findOne({ email });

  if(!user) {
    return res.status(200).json({
      message : "If account exists, reset email sent"
    })
  }

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  const resetUrl = `http://localhost:3000/api/users/reset-password/${resetToken}`;
  const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;

  await sendEmail({
    to : user.email,
    subject : "Password Reset Request",
    text : message
  })

  res.status(200).json({
    message : "PASSWORD RESET LINK SENT TO YOUR EMAIL"
  })
})

const resetPassword = asyncHandler ( async(req, res) => {
  // reset token from URL params
  const { token } = req.params;
  const { newPassword } = req.body;

  // Hash the token from the URL to compare with the hashed token in the database
  const hashedToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");

  // Find the user with the matching reset token and check if it's not expired
  const user = await User.findOne({
   passwordResetToken: hashedToken,
   passwordResetExpires: { $gt: Date.now() }
  });

  // If no user is found, the token is invalid or expired
  if(!user) {
    return res.status(400).json({
      message : "INVALID OR EXPIRED RESET TOKEN"
    })
  }

  // Hash the new password and update the user's password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;

  // Clear the reset token and expiration time
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    message : "PASSWORD RESET SUCCESSFUL"
  });

});

const forgotPasswordOtp = asyncHandler ( async(req, res, next) => {

  const { email } = req.body;
  
  //generate 6 digit otp
  const OTP = crypto.randomInt(100000, 999999).toString();

  const user = await User.findOne({ email })

  if(!user) {
    return res.status(200).json({
      message : "If account exists, reset email sent"
    })
  }
  
  const hashedOTP = crypto
  .createHash("sha256")
  .update(OTP)
  .digest("hex");

  user.otp = hashedOTP;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save()

  const message = `Your OTP for password reset is: ${OTP}`;

  await sendEmail({
    to : user.email,
    subject : "Password Reset OTP",
    text : message
  })

  
  res.status(200).json({
    message : "OTP SENT TO YOUR EMAIL"
  })
})

const resetPasswordOtp = asyncHandler( async(req, res) => {
  const { email, otp, newPassword } = req.body;

  if(!email || !otp || !newPassword) {
    return res.status(400).json({
      message : "Email, OTP and new password are required"
    })
  }

  // Find the user by email
  const user = await User.findOne({email});

  if(!user) {
    return res.status(404).json({
      message : "Invalid request"
    })
  }

  // Check if user exists, OTP is correct and not expired
  if(Date.now() > user.otpExpiry){
    return res.status(400).json({
    message : "OTP Expire"
  })}

  // hash the received OTP 
  const hashedOtpRecive = crypto
  .createHash("sha256")
  .update(otp)
  .digest("hex");

  // compare hashed received OTP with stored hashed OTP
  if(hashedOtpRecive !== user.otp){
    return res.status(400).json({
      message : "OTP WRONG"
    })
  }
  
  // Hash the new password and update the user's password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;

  user.otp = ""
  user.otpExpiry = ""
  await user.save()

  res.status(200).json({
    message : "PASSWORD RESET SUCCESSFUL"
  });
})


export { forgotPassword, resetPassword, forgotPasswordOtp, resetPasswordOtp };