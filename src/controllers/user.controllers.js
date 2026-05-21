import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const users = [];

const registerUser = async (req, res) => {

  const {fullname, email, password} = req.body;


  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10 );


  // Create a new user object
  const newUser = {
    fullname,
    email,
    password: hashedPassword
  };


  // Add the new user to the users array
  users.push(newUser);

  // Save the users array to a file (for simplicity, using JSON file here)
  fs.writeFileSync('./public/users.json', JSON.stringify(users));

  res
    .status(201)
    .json(
      { 
        message : "User registered successfully" 
      }
    );

};

const loginUser = async (req, res ) =>{

  const {email, password} = req.body;

  // Read users from the file and parse it
  const usersData = fs.readFileSync('./public/users.json', 'utf-8');
  const users = JSON.parse(usersData);

  // Find the user by email
  const user = users.find((u)=>(u.email === email))

  // If user not found, return an error
  if (!user) {
    return res.status(404).json({ message: "USER NOT FOUND" });
  }

  // Compare the provided password with the stored hashed password
  try{
    const pass = await bcrypt.compare(password, user.password);
  }
  catch(err){
    console.error('Error comparing passwords:', err);
  }

  // If the password is incorrect, return an error
  if(!pass)return res.status(401).json({ message: "WRONG PASSWORD" });

  //jwt 
  const token = jwt.sign(
    {
      email: user.email,
      password: user.password
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