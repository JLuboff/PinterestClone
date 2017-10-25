const express = require('express'),
      routes = require('./routes/routes'),
      hbs = require('hbs'),
      passport = require('passport'),
      MongoClient = require('mongodb').MongoClient,
      ObjectID = require('mongodb').ObjectID,
      port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'hbs');
app.use(passport.initialize());
app.use(passport.session());

routes(app, passport, db);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
