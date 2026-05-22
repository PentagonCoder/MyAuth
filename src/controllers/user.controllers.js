import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

const registerUser = async (req, res) => {

  const {fullname, email, password} = req.body;
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if(!userExists) 
      return res.status(400).json({ 
        message: "USER ALREADY EXISTS" 
    });
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10 );
    
    
    // Create a new user object
    const newUser = await User.create({ 
    name: fullname,
    email,
    password: hashedPassword
  });
  
  
  console.log(newUser);
  
  
  res
  .status(201)
  .json(
    { 
      message : "User registered successfully" 
    }
  );
} catch (error) {
  console.error('Error registering user:', error);
  res.status(500).json({ 
    message: "INTERNAL SERVER ERROR" 
  });
}
};

const loginUser = async (req, res ) =>{

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
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }

  )

  res.send(
    {
      message : "login successfully",
      token
    }
  );

}

const getProfile = (req, res) => {
  res.send(`Welcome to your profile, ${req.user.email}!`);
}

export { registerUser, loginUser, getProfile };