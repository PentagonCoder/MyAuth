const authorizeRoles  = (roles)=>{
  
  return (req, res, next) => {
    const user = req.user;
    
    if(user.role !== roles){ 
      return res.status(403).json({ message: "ACCESS DENIED" });
    }
    next();
  }
}

export {authorizeRoles};