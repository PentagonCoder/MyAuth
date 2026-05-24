import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
  return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h"
      }
  
    )  
}

const generateRefreshToken = (user) => {
  return jwt.sign(
      {
        _id : user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d"
      }
  
    )  
}

export { generateAccessToken, generateRefreshToken };