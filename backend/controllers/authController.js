const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.debug('Register attempt for:', { username, email });

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email and password are required' });
    }

    // Check duplicates
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username or email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashed });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // return _id (and keep id for backward compatibility)
    res.status(201).json({
      success: true,
      data: {
        user: { _id: newUser._id, id: newUser._id, username: newUser.username, email: newUser.email, picture: newUser.picture || '' },
        token
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    console.debug('Login attempt for:', { emailOrUsername });
    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, message: 'Email/username and password are required' });
    }

    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // return _id so clients can use a consistent property
    res.status(200).json({
      success: true,
      data: {
        user: { _id: user._id, id: user._id, username: user.username, email: user.email, picture: user.picture || '' },
        token
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Google Sign-In using ID token from client
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: 'idToken is required' });

    // Verify token with Google's tokeninfo endpoint
    const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    const resp = await fetch(verifyUrl);
    if (!resp.ok) {
      console.error('Google tokeninfo failed', await resp.text());
      return res.status(401).json({ success: false, message: 'Invalid Google ID token' });
    }

    const payload = await resp.json();
    // payload contains: email, email_verified, name, picture, sub (google user id)
    const { email, email_verified, name, picture, sub } = payload;
    if (!email || !email_verified) {
      return res.status(400).json({ success: false, message: 'Google account email not available or not verified' });
    }

    // find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // generate a username from name or email
      const base = (name || email.split('@')[0]).replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';
      let username = base;
      let suffix = 1;
      while (await User.findOne({ username })) {
        username = `${base}${suffix++}`;
      }

      // create a random password for social accounts (never exposed to user)
      const randomPass = Math.random().toString(36).slice(2, 12);
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(randomPass, salt);

      user = new User({ username, email: email.toLowerCase(), password: hashed, picture: picture || '', googleId: sub || '' });
      await user.save();
    }

    // if user exists but missing picture or googleId, update them
    else {
      const needsUpdate = (!user.picture && picture) || (!user.googleId && sub);
      if (needsUpdate) {
        user.picture = user.picture || picture || '';
        user.googleId = user.googleId || sub || '';
        await user.save();
      }
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.status(200).json({ success: true, data: { user: { _id: user._id, id: user._id, username: user.username, email: user.email, picture: user.picture || '' }, token } });
  } catch (error) {
    console.error('Error in googleAuth:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, googleAuth };