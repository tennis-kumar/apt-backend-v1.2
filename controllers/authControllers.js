import User from '../models/User.js';
import { sendOTPEmail } from '../services/emailService.js';
import {generateAuthToken} from '../utils/helpers.js'

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

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  
  try {
    const user = await User.findOne({ email });
    console.log(`Stored OTP: ${user?.otp?.code}`); // Log stored OTP
    console.log(`OTP Expiry: ${user?.otp?.expiresAt}`); // Log expiry
    
    if (!user.otp) return res.status(400).json({ error: 'OTP not found' });
    if (user.otp.code !== otp) { return res.status(400).json({ error: 'Invalid OTP' }) };
    if (user.otp.expiresAt < new Date()){ return res.status(400).json({ error: 'OTP expired' })};

    user.isVerified = true;
    user.otp = null; // Clear OTP after successful verification
    await user.save();

    const token = generateAuthToken(user);

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

}