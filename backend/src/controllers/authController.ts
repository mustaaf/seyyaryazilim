import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';

// Generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// @desc    Register admin user
// @route   POST /api/auth/register
// @access  Public (should be protected in production)
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });

  if (existingUser) {
    return res.status(400).json({ message: 'Kullanıcı zaten mevcut' });
  }

  // Create user
  const user = new User({
    username,
    email,
    password,
    role: role || 'manager'
  });

  await user.save();

  // Generate token
  const token = generateToken((user._id as any).toString());

  res.status(201).json({
    message: 'Kullanıcı başarıyla oluşturuldu',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Find user
  const user = await User.findOne({ 
    $or: [{ username }, { email: username }],
    isActive: true
  });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken((user._id as any).toString());

  res.json({
    message: 'Giriş başarılı',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }
  });
});
