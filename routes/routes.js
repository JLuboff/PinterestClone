const bodyParser = require('body-parser'),
      ObjectId = require('mongodb').ObjectId;

module.exports = (app, passport, db) => {
  const isLogged = (req, res, next) => {
    if(req.isAuthenticated()) return next();
    return res.redirect('/login');
  };

  app.route('/').get((req, res) => {
    console.log(req.user);
    let loggedIn = req.user != undefined ? true : false,
        id = req.user != undefined ? req.user._json.id : undefined;

    db.collection('posts').find().toArray((err, doc) =>{
      if(err) throw err;
      res.render('index.hbs', {loggedIn, id, doc});
    })
  })

  app.route('/usersPosts/:id').get(isLogged, (req, res) => {
    db.collection('posts').find({'post.user': Number(req.params.id)}).toArray((err, data) => {
      if(err) throw err;
      res.render('userspost.hbs', {loggedIn: true, data})
    })
  })

  app.route('/seeUserPosts/:id').get((req, res) => {
    let loggedIn = req.user != undefined ? true : false;
    db.collection('posts').find({'post.user': Number(req.params.id)}).toArray((err, data) => {
      if(err) throw err;
      res.render('seeuserposts.hbs', {loggedIn, data})
    })
  })

  app.route('/deletePost/:id').delete((req, res) => {
    db.collection('posts').findOneAndDelete({_id: ObjectId(req.params.id)}).then(() => {
      db.collection('posts').find({'post.user': Number(req.user._json.id)}).toArray((err, data) => {
        if(err) throw err;

        res.json(data);
      })
    })
  })

  app.route('/postCounter/:id').post((req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    db.collection('posts').aggregate([{$match: {_id: ObjectId(id)}}, {$unwind: '$post.likedBy'}, {$match: {'post.likedBy': req.user._json.id}}], (err, doc) => {
      if(err) throw err;
      console.log(doc);
      if(doc.length){
        db.collection('posts').findOneAndUpdate({_id: ObjectId(id)}, { $inc: {'post.likes': -1}, $pull: {'post.likedBy' : req.user._json.id}}, {upsert: true, returnOriginal: false}, (err, doc) => {
          if(err) throw err;
          console.log('Found: ' + JSON.stringify(doc.value));
          res.json(doc.value);
        })
      } else {
        db.collection('posts').findOneAndUpdate({_id: ObjectId(id)}, { $inc: {'post.likes': 1}, $addToSet: {'post.likedBy': req.user._json.id}}, {upsert: true, returnOriginal: false}, (err, doc) => {
          if(err) throw err;
          console.log('Not Found: ' + JSON.stringify(doc.value));
          res.json(doc.value);
        });
      }
    })
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

  app.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.route('/auth/twitter/callback').get(passport.authenticate('twitter', { failureRedirect: '/login'}), (req, res) => {
      res.redirect('/');
    });
}
