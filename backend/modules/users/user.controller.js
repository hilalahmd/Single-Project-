import User from './user.model.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const updateProfile = async (req, res) => {
  try {
    const { name, preferredLanguage, languagesSpoken } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, preferredLanguage, languagesSpoken },
      { new: true }
    ).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')

    res.json({ message: 'Profile updated', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}



export const updateBodyMetrics = async (req, res) => {
  try {
    const { height, weight, age, gender, activityLevel, goal, calorieTarget } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bodyMetrics: { height, weight, age, gender, activityLevel, goal, calorieTarget } },
      { new: true }
    ).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')

    res.json({ message: 'Body metrics updated', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}