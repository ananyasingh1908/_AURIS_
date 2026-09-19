import { config } from '../config/env.js';
import { findUserByEmail, findUserByRole, issueToken, operationalUsers } from '../services/authService.js';

export const login = (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const token = issueToken(user);

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
      clearanceLevel: user.clearanceLevel
    }
  });
};

export const googleAuth = (req, res) => {
  const { role, email, name, avatar, credential, country, city } = req.body || {};

  let user = null;

  if (role) {
    user = findUserByRole(role);
  } else if (email) {
    user = findUserByEmail(email);
  }

  if (!user) {
    // If dynamic citizen or carbon developer signing in with Google
    user = {
      id: `google-${Date.now().toString(36)}`,
      name: name || 'Google Verified User',
      email: email || 'ananyasingh561329@gmail.com',
      role: role || 'CITIZEN',
      department: 'Google Workspace Authenticated',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      clearanceLevel: 'Google OAuth 2.0 Verified',
      country: country || 'India',
      city: city || 'Mumbai',
      authProvider: 'google'
    };
  } else {
    user = {
      ...user,
      name: name || user.name,
      avatar: avatar || user.avatar,
      country: country || 'India',
      city: city || 'Mumbai',
      authProvider: 'google'
    };
  }

  const token = issueToken(user);

  return res.json({
    success: true,
    message: 'Google authentication successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
      clearanceLevel: user.clearanceLevel,
      country: user.country,
      city: user.city,
      authProvider: 'google'
    }
  });
};

export const getRoles = (req, res) => {
  return res.json({
    success: true,
    roles: operationalUsers.map(({ password, ...rest }) => rest)
  });
};

export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  return res.json({
    success: true,
    user: req.user
  });
};

