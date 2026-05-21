import jwt from 'jsonwebtoken';

const verifyjwt = (req, res, next) => {
  const token = req.body.token;
  
  if (!token) {
    return res.status(401).json({ message: "NO TOKEN PROVIDED" });
  }

  try {

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET
    );
    
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "INVALID TOKEN" });
  }
} 

export { verifyjwt };