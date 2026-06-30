import nodemailer from 'nodemailer'

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'FitForge - Your OTP Code',
    html: `
      <h2>FitForge Verification</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Expires in 10 minutes.</p>
    `
  })
}