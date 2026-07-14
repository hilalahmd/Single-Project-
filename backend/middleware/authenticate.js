import jwt from 'jsonwebtoken'
import User from '../modules/users/user.model.js'

/**
 * protect — verifies the JWT cookie and loads the user.
 * Uses .lean() so we get a plain JS object (faster, less memory) instead of
 * a full Mongoose document — no .save() is needed in middleware.
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // .lean() returns a plain JS object — faster, no Mongoose overhead
    // WHY: middleware runs on every request; saving even a few ms matters at scale
    let user = await User.findById(decoded.userId).select('-password').lean()
    
    // Fallback to Manager collection if not found in User
    if (!user) {
      const Manager = (await import('../modules/manager/manager.model.js')).default
      user = await Manager.findById(decoded.userId).select('-password').lean()
    }
    
    // Guard against tokens that reference a deleted user account
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account no longer exists' })
    }

    // Block suspended accounts from accessing any protected route
    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support.' })
    }

    req.user = user
    next()

  } catch (error) {
    // Catch jwt.verify errors (expired, invalid signature, etc.)
    res.status(401).json({ success: false, message: 'Not authorized, invalid token' })
  }
}

/**
 * restrictTo — role-based access control.
 * Called after protect, so req.user is guaranteed to exist.
 */
export const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' })
  }
  next()
}