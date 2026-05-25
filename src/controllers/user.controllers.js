import {asyncHandler} from '../utils/asyncHandler.js'
import {generateAccessToken, generateRefreshToken} from '../utils/tokenUtils.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import crypto from "crypto";
import { sendEmail } from '../utils/sendEmail.js';

const generateAccessTokenandRefreshToken = async (user) => {
  try {
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw error;
  }
};

const registerUser = asyncHandler( async (req, res, ) => {
  
  const {fullname, email, password, role} = req.body;
  
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if(userExists) 
      return res.status(400).json({ 
        message: "USER ALREADY EXISTS" 
    });


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10 );
    
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const hashedVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    
    // Create a new user object
    const newUser = await User.create({ 
    name: fullname,
    email,
    password: hashedPassword,
    role: role || 'user',
    verificationToken: hashedVerificationToken,
    verificationTokenExpires

  });

  const verificationLink = `http://localhost:3000/api/users/verify-email/${verificationToken}`;
  const message = `Please verify your email by clicking the following link: ${verificationLink}`;
  
  await sendEmail({
    to: newUser.email,
    subject: "Verify your email",
    text: message
  });

  console.log(newUser);
  
  
  res
  .status(200)
  .json(
    { 
      message : "Please verify your email" 
    }
  );
  }
)

const emailVerify = asyncHandler(async (req, res)=>{
  const {token} =req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ verificationToken : hashedToken})

  if(!user) {
    return res.status(400).json({
      message : "INVALID OR EXPIRED RESET TOKEN"
    })
  }
  
  if(user.isVerified){
    return res.status(403).json({ message: "User already verified" });
  }

  if(Date.now() > user.verificationTokenExpires){
    return res.status(400).json({
    message : "token Expired"
  })}

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save()

  res.status(201)
  .json({ message : "your email is verify " });
  
})

const loginUser = asyncHandler(async (req, res ) =>{

  const {email, password} = req.body;

  if(!email || !password) 
    return res.status(400).json({ 
    message: "EMAIL AND PASSWORD ARE REQUIRED" 
  });


  // Find the user by email
  const user = await User.findOne({ email });

  // If user not found, return an error
  if (!user) {
    return res.status(404).json({ message: "USER NOT FOUND" });
  }

  // Check if the user's email is verified
  if(user.isVerified === false){
    return res.status(403).json({ message: "PLEASE VERIFY YOUR EMAIL TO LOGIN" });
  }
  
  // Compare the provided password with the stored hashed password
  let pass = false;
  try{
    pass = await bcrypt.compare(password, user.password);
  }
  catch(err){
    console.error('Error comparing passwords:', err);
  }

  // If the password is incorrect, return an error
  if(!pass)return res.status(401).json({ message: "WRONG PASSWORD" });

  //jwt generation
  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user);
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  };
  res
  .status(200)
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .json(
    {
      message : "login successfully",
      accessToken,
      refreshToken
    }
  );

})

const logoutUser = asyncHandler(async (req, res) => {

  // Get the user from auth middleware
  const user = req.user;

  const foundUser = await User.findById(user.id);
  
  if (!foundUser) {
    return res.status(401).json({ message: "USER NOT AUTHENTICATED" });
  }

  foundUser.refreshToken = "";
  await foundUser.save();

  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "LOGOUT SUCCESSFUL" });
})

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "NO REFRESH TOKEN PROVIDED" });
  }

  try {

    //decode the token to get the user ID
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(401).json({ message: "INVALID REFRESH TOKEN" });
    }

    // Check if the refresh token matches the one stored in the database
    if (user.refreshToken !== token) {
      return res.status(401).json({ message: "REFRESH TOKEN MISMATCH" });
    }

    const accessToken = await generateAccessToken(user);
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({ message: "AccessToken generated successfully", accessToken });
  } catch (error) {
    return res.status(403).json({ message: "INVALID OR EXPIRED REFRESH TOKEN", error: error.message });
  }
});


const getProfile = asyncHandler( async(req, res) => {
  res.send(`Welcome to your profile, ${req.user.email}!`);
})

const adminDashboard = asyncHandler( async(req, res) => {
  res.send(`Welcome to adminDashboard, ${req.user.email}!`);
})

export { registerUser, emailVerify, loginUser, getProfile, refreshToken, logoutUser, adminDashboard };