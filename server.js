const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.js');

// connect to mongoDB Atlas database
require('dotenv').config();
mongoose.connect(
  process.env.DB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (req, res) => {
    console.log('Connected to database');
  }
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/exercise/new-user/', (req, res) => {
  const newUser = new User({
    username: req.body.username,
  });
  const response = newUser.save().then((i) => i);
  console.log(response);

  res.end();
});

app.get('/api/exercise/users/', (req, res) => {
  console.log('users: ', req.body);
  res.end();
});

app.post('/api/exercise/add/', (req, res) => {
  console.log('add: ', req.body);
  res.end();
});

app.get('/api/exercise/log/', (req, res) => {
  console.log('log: ', req.body);
  res.end();
});

app.get('/api/exercise/log/:id/:from?/:to?/:limit?/', (req, res) => {
  console.log('log params: ', req.params);
  res.end();
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
