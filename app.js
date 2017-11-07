const express = require('express'),
      routes = require('./routes/routes'),
      hbs = require('hbs'),
      passport = require('passport'),
      TwitterStrategy = require('passport-twitter'),
      session = require('express-session'),
      MongoClient = require('mongodb').MongoClient,
      ObjectID = require('mongodb').ObjectID,
      dotenv = require('dotenv').config(),
      bodyParser = require('body-parser');
      port = process.env.PORT || 3000;

const app = express();

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITKEY,
  consumerSecret: process.env.TWITSECRET,
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
  secret: process.env.SESSSECRET,
  resave: true,
  saveUnitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(`${process.env.MONGOROUTE}`, (err, db) =>{

routes(app, passport, db);
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
