const jwt = require('jsonwebtoken');
const constant = require('../constant');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader;
  
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    jwt.verify(token, constant.constant.secretKey, (err, user) => {
      if (err) {
        res.status(403).json({ message: 'Invalid token' });
      } else {
        req.user = user;
        next();
      }
    });
  }
};

module.exports = { authenticateToken }