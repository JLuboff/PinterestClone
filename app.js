const express = require('express'),
      routes = require('./routes/routes'),
      hbs = require('hbs'),
      passport = require('passport'),
      TwitterStrategy = require('passport-twitter'),
      session = require('express-session'),
      MongoClient = require('mongodb').MongoClient,
      ObjectID = require('mongodb').ObjectID,
      port = process.env.PORT || 3000;

const app = express();

passport.use(new TwitterStrategy({
  consumerKey: 'cpxEIrdjiyNfzzx1XMTLSFOd0',
  consumerSecret: '31w6lSlMrAHKX2X8wvxDfSciIBiFGwsLjMwGrEAyWoKuSYZJFB',
  callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
},
(token, tokenSecret, profile, cb) => {
  if(profile){
    user = profile;
    return cb(null, user);
  } else {
    return done(null, false);
  };
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

app.set('view engine', 'hbs');
app.use(session({
  secret: "potato",
  resave: true,
  saveUnitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

routes(app, passport /*db*/);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
