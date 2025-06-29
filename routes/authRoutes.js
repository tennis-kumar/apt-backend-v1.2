import express from 'express';
import { initiateLogin, verifyOTP } from '../controllers/authControllers.js';

const router = express.Router();
router.post('/login', initiateLogin);
router.post('/verify', verifyOTP);
router.post('/login/existing', async (req, res) => {
  try {
    const { apartmentName, emailId, flatNumber, otp } = req.body;

    // 1. Find apartment by name
    const apartment = await Apartment.findOne({ name: apartmentName });
    if (!apartment) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Apartment not found' 
      });
    }

    // 2. Find flat
    const flat = await Flat.findOne({ 
      apartment: apartment._id,
      flatNumber 
    });
    if (!flat) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Flat not found' 
      });
    }

    // 3. Verify OTP (using existing logic)
    const { isValid, user } = await verifyOTP(emailId, otp);
    if (!isValid) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid OTP' 
      });
    }

    // 4. Link user to flat if not already
    if (!user.flat) {
      user.flat = flat._id;
      await user.save();
    }

    // 5. Generate token
    const token = generateAuthToken(user);

    res.json({ 
      status: 'success',
      token: `Bearer ${token}`
    });

  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});
export default router;