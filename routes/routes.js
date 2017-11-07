const bodyParser = require('body-parser');

module.exports = (app, passport, db) => {
  const isLogged = (req, res, next) => {
    if(req.isAuthenticated()) return next();
    return res.redirect('/login');
  };
//  const Posts = db.collection('posts');

  app.route('/').get((req, res) => {
    console.log(req.user);
    db.collection('posts').find().toArray((err, doc) =>{
      if(err) throw err;
      res.send(doc);
    })
  })

  app.route('/usersPosts/:id').get((req, res) => {
    db.collection('posts').find({})
  })

  app.route('/createPost').get(isLogged, (req, res) => {
    res.render('createpost.hbs');
  }).post((req, res) => {
    console.log(req.body);
    let post = {
      user: req.user._json.id,
      username: req.user._json.screen_name,
      avatar: req.user._json.profile_image_url_https,
      likes: 0,
      likedBy: [],
      postImage: req.body.imageUrl,
      postDescription: req.body.description
    };

    db.collection('posts').insertOne({post});
    res.redirect(`/usersPosts/${req.user.id}`);
  })
  app.route('/login').get(passport.authenticate('twitter'));

  app.route('/auth/twitter/callback').get(passport.authenticate('twitter', { failureRedirect: '/login'}), (req, res) => {
      res.redirect('/');
    });
}
