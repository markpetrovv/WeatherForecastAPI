const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Store user information in the session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    // Redirect user to the main page
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  // Invalidate the JWT token here, or clear the session (depending on your implementation).
  res.json({ message: 'Logged out successfully' });
};