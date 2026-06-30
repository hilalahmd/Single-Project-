import jwt from 'jsonwebtoken'
import User from '../modules/users/user.model.js'

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.userId).select('-password')
    next()

  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' })
  }
}

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' })
  }
  next()
}