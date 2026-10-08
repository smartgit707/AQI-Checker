import { registerUser, loginUser } from '../services/authService.js';
import { getUserProfile } from '../services/userService.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await registerUser({ name, email, password, role });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  res.clearCookie('token', COOKIE_OPTIONS);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}

export async function getMe(req, res, next) {
  try {
    const user = await getUserProfile(req.user.id);
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
}
