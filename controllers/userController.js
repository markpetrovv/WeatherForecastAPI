const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({message: 'User registered successfully'});
  } catch (err) {
    res.status(400).json({error: err.message});
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({error: 'Invalid password'});
    }

    // user information added in the session
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    // redirect logged in user to the main page
    res.redirect('/');
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

exports.logout = (req, res) => {
  // destroying the session
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({error: err.message});
    }
    res.redirect('/');  // redirecting to the main page
  });
};