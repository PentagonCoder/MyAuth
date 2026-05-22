import jwt from 'jsonwebtoken';

const verifyjwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      message: "NO TOKEN PROVIDED" 
    });
  }

  const token = authHeader.split(" ")[1];

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