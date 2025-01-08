const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  
  const token = req.header('Authorization')?.replace('Bearer ', '');  // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'token yoq. Avtorizatsiya muvaffaqiyatsiz.' });
  }

  try {
    
    const decoded = jwt.verify(token, 'mirobid'); 
    req.user = decoded; 
    next();  
  } catch (err) {
    res.status(400).json({ message: 'token notogri' });
  }
};

module.exports = jwtMiddleware;
