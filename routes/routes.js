
module.exports = (app, passport/*, db*/) => {
  const isLogged = (req, res, next) => {
    if(req.isAuthenticated()) return next();
    return res.redirect('/login');
  };

  app.route('/login')
    .get(passport.authenticate('twitter'));

  app.route('/auth/twitter/callback')
    .get(passport.authenticate('twitter', {failureRedirect: '/login'}), (req, res) => {
      console.log(req.user);
      res.send('Successfully logged in');
    });
}
