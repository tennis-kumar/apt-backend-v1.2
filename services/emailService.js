import brevo from '@getbrevo/brevo';

const sendOTPEmail = async (email, otpCode) => {
  const defaultClient = brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new brevo.TransactionalEmailsApi();
  const sender = { email: 'kumarteneesh@gmail.com', name: 'Apartment Management' };

  try {
    await apiInstance.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: 'Your Login OTP',
      htmlContent: `Your OTP is: <strong>${otpCode}</strong> (valid for 15 minutes)`
    });
    console.log('📧 OTP Sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Email Error:', error);
    return false;
  }
};

export { sendOTPEmail };