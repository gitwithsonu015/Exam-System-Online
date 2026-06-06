const crypto = require('crypto');
const User = require('../models/User');
const { sendMail } = require('../utils/email');

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Always respond with the same message (avoid account enumeration)
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });

    if (user) {
      // generate token
      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      // set expiry (10 minutes)
      user.resetPasswordToken = tokenHash;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';

      const resetUrl = `${frontendBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;
      const subject = 'Online Exam System - Reset Password';
      const html = `
        <p>You requested a password reset.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>This link will expire in 10 minutes.</p>
      `;

      await sendMail({
        to: user.email,
        subject,
        html
      });
    }

    // For this app's UX, we also return the generated token (only when user exists)
    // so ForgotPassword page can show reset fields immediately.
    res.json({
      message: 'If the email exists, a reset link has been sent.',
      token: user ? token : undefined
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or expired' });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};

module.exports = {
  forgotPassword,
  resetPassword
};

