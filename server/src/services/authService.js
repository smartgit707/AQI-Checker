import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepository from '../db/repositories/userRepository.js';
import { isDBConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aerosense_jwt_secure_secret_production_2026_xyz!';
const JWT_EXPIRES_IN = '7d';

/**
 * Resilient In-Memory User Store
 * Acts as fallback when MongoDB daemon is not running in local development.
 */
const IN_MEMORY_USERS = new Map();

// Initialize Demo Account in In-Memory Store
const demoPasswordHash = bcrypt.hashSync('password123', 10);
IN_MEMORY_USERS.set('demo@aerosense.air', {
  _id: 'user_demo_101',
  name: 'Dr. Aarav Sharma',
  email: 'demo@aerosense.air',
  passwordHash: demoPasswordHash,
  role: 'user',
  isActive: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  favoriteCities: ['delhi', 'mumbai', 'bengaluru'],
  recentCities: [
    { slug: 'delhi', visitedAt: new Date(Date.now() - 1000 * 60 * 30) },
    { slug: 'varanasi', visitedAt: new Date(Date.now() - 1000 * 60 * 120) }
  ],
  settings: {
    temperatureUnit: 'C',
    defaultDashboardView: 'detailed'
  },
  lastLoginAt: new Date(),
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date()
});

// Initialize Admin Account in In-Memory Store
const adminPasswordHash = bcrypt.hashSync('AdminPass2026!', 10);
IN_MEMORY_USERS.set('admin@aerosense.air', {
  _id: 'user_admin_001',
  name: 'Director Environmental Operations',
  email: 'admin@aerosense.air',
  passwordHash: adminPasswordHash,
  role: 'admin',
  isActive: true,
  avatar: '',
  favoriteCities: ['delhi', 'mumbai', 'kolkata', 'chennai', 'bengaluru'],
  recentCities: [],
  settings: {
    temperatureUnit: 'C',
    defaultDashboardView: 'detailed'
  },
  lastLoginAt: new Date(),
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date()
});

export function getInMemoryUsers() {
  return IN_MEMORY_USERS;
}

export function hashPassword(plainText) {
  return bcrypt.hash(plainText, 10);
}

export function comparePassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

export function generateToken(user) {
  const payload = {
    id: user._id ? user._id.toString() : user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user'
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function sanitizeUser(user) {
  if (!user) return null;
  const userObj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete userObj.passwordHash;
  delete userObj.__v;
  // Ensure string id
  userObj.id = (userObj._id || userObj.id || '').toString();
  userObj.role = userObj.role || 'user';
  userObj.isActive = userObj.isActive !== false;
  return userObj;
}

/**
 * Register a new user
 */
export async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Invalid email format');
  }

  if (isDBConnected()) {
    const existing = await userRepository.findUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.insertUser({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: 'user',
      avatar: ''
    });

    const token = generateToken(user);
    return { user: sanitizeUser(user), token };
  }

  // Fallback in-memory
  if (IN_MEMORY_USERS.has(cleanEmail)) {
    throw new Error('An account with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    role: 'user', // Always user, no privilege escalation
    isActive: true,
    avatar: '',
    favoriteCities: [],
    recentCities: [],
    settings: {
      temperatureUnit: 'C',
      defaultDashboardView: 'detailed'
    },
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  IN_MEMORY_USERS.set(cleanEmail, newUser);
  const token = generateToken(newUser);
  return { user: sanitizeUser(newUser), token };
}

/**
 * Authenticate existing user
 */
export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const cleanEmail = email.trim().toLowerCase();

  if (isDBConnected()) {
    const user = await userRepository.findUserByEmail(cleanEmail);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    await userRepository.updateLastLogin(user.id);
    user.lastLoginAt = new Date();

    const token = generateToken(user);
    return { user: sanitizeUser(user), token };
  }

  // Fallback in-memory
  const user = IN_MEMORY_USERS.get(cleanEmail);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  user.lastLoginAt = new Date();
  user.updatedAt = new Date();

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
}
