// server.js - Complete Backend with All Routes
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Email Configuration (using Gmail)
// IMPORTANT: Replace with your Gmail and App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',        // ← REPLACE THIS
    pass: 'your-app-password'            // ← REPLACE THIS
  }
});

// MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017/joblink_auth';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ==================== SCHEMAS ====================

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['employee', 'employer', null],
    default: null
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Employee Profile Schema
const employeeProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema);

// Employer Profile Schema
const employerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  employerName: {
    type: String,
    required: true
  },
  officialEmail: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  companyAddress: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true
  },
  hrContactDetails: {
    type: String,
    default: ''
  },
  companyLogo: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);

// ==================== ROUTES ====================

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'JobLink API is running',
    endpoints: [
      'POST /register',
      'POST /login',
      'POST /set-role',
      'POST /employee-profile',
      'POST /employer-profile',
      'POST /forgot-password',
      'POST /reset-password'
    ]
  });
});

// ==================== AUTHENTICATION ROUTES ====================

// Register route
app.post('/register', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate input
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { 
        id: newUser._id,
        email: newUser.email 
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return user data with profile status
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { 
        id: user._id,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// ==================== ROLE & PROFILE ROUTES ====================

// Set Role route
app.post('/set-role', async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: 'User ID and role are required'
      });
    }

    if (!['employee', 'employer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "employee" or "employer"'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Role set successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });

  } catch (error) {
    console.error('Set role error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error setting role'
    });
  }
});

// Employee Profile Setup route
app.post('/employee-profile', async (req, res) => {
  try {
    const { userId, fullName, phoneNumber, skills, qualification, experience, resume } = req.body;

    if (!userId || !fullName || !phoneNumber || !qualification) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing (fullName, phoneNumber, qualification)'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create or update employee profile
    const employeeProfile = await EmployeeProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        fullName,
        email: user.email,
        phoneNumber,
        skills: skills || [],
        qualification,
        experience: experience || '',
        resume: resume || ''
      },
      { upsert: true, new: true }
    );

    // Mark profile as completed
    user.profileCompleted = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Employee profile created successfully',
      profile: employeeProfile
    });

  } catch (error) {
    console.error('Employee profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating employee profile'
    });
  }
});

// Employer Profile Setup route
app.post('/employer-profile', async (req, res) => {
  try {
    const { userId, companyName, employerName, phoneNumber, companyAddress, businessType, hrContactDetails, companyLogo } = req.body;

    if (!userId || !companyName || !employerName || !phoneNumber || !companyAddress || !businessType) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create or update employer profile
    const employerProfile = await EmployerProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        companyName,
        employerName,
        officialEmail: user.email,
        phoneNumber,
        companyAddress,
        businessType,
        hrContactDetails: hrContactDetails || '',
        companyLogo: companyLogo || ''
      },
      { upsert: true, new: true }
    );

    // Mark profile as completed
    user.profileCompleted = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Employer profile created successfully',
      profile: employerProfile
    });

  } catch (error) {
    console.error('Employer profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating employer profile'
    });
  }
});

// ==================== PASSWORD RECOVERY ROUTES ====================

// Forgot Password route
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create reset link
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: 'your-email@gmail.com',  // ← REPLACE THIS
      to: email,
      subject: 'Password Reset Request - JobLink',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #10b981; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetLink}</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">JobLink Authentication System</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending reset email. Make sure email is configured.'
    });
  }
});

// Reset Password route
app.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚀 JobLink API Server Running           ║
║   📡 Port: ${PORT}                         ║
║   🌐 URL: http://localhost:${PORT}         ║
║   📊 MongoDB: Connected                    ║
║   ✅ Status: Ready                         ║
╚════════════════════════════════════════════╝

Available Endpoints:
  GET  /                    - Health check
  POST /register            - User registration
  POST /login               - User login
  POST /set-role            - Set user role
  POST /employee-profile    - Create employee profile
  POST /employer-profile    - Create employer profile
  POST /forgot-password     - Request password reset
  POST /reset-password      - Reset password
  `);
});