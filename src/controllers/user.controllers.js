import bcrypt from 'bcrypt';
import fs from 'fs';

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

  res.status(201).send( users);

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
    return res.send("not register");
  }

  // Compare the provided password with the stored hashed password
  const pass = await bcrypt.compare(password, user.password);

  // If the password is incorrect, return an error
  if(!pass)return res.send("wrong password");

  res.send("login successfully");

}

export { registerUser, loginUser };