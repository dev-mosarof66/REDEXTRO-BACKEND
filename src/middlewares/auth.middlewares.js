import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.cookies.authorization;
    // console.log('authHeader', authHeader);

    if (!authHeader) {
      return res.status(403).json({ message: 'Login sesseion expired', code: 403 });
    }

    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);

    req.user = decoded?.id
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Login sesseion expired', code: 403 });
  }
};
