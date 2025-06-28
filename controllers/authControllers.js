import User from '../models/User.js';
import { sendOTPEmail } from '../services/emailService.js';

export const initiateLogin = async (req, res) => {
  const { email } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (!user) user = new User({ email });

    const otp = user.generateOTP();
    await user.save();

    const emailSent = await sendOTPEmail(email, otp);
    
    if (emailSent) {
      res.json({ success: true, message: 'OTP sent to email' });
    } else {
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};