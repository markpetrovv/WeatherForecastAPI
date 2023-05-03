// access restriction for non-logged in users
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    //check if the user is authenticated
    if (req.session && req.session.user) {
      return next();  // calling the next middleware
    } else {
      req.flash('error_msg', 'Please log in to view this resource');
      res.redirect('/login');
    }
  },
};