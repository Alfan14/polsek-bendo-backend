import jwt from 'jsonwebtoken';
const { SECRET_KEY } = process.env;

function authenticate(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
  
    if (!token) return res.status(403).json({ message: 'Token is required' });
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
}

function authorize(roles = []) {
    return (req, res, next) => {
      if (!roles.length) return next();
  
      const userRole = req.user?.role; 
      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ message: 'Access Denied' });
      }
  
      next();
    };
}
  
export default { authenticate,authorize };