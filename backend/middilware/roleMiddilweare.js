const admin = (req, res, next) => {
 
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }


  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "You are not admin" });
  }

  
  next();
};

module.exports = { admin };
