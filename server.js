const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.js');

// connect to mongoDB Atlas database
require('dotenv').config();
mongoose.connect(
  process.env.DB_URI, // remember to add this to remote host
  {
    useUnifiedTopology: true, // these fix deprecated mongoose stuff
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  },
  (req, res) => {
    console.log('Connected to database');
  }
);

app.use(cors());
app.use(express.urlencoded({ extended: true })); // parse requests
app.use(express.static('public')); // serve this folder
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/exercise/new-user/', (req, res) => {
  // mongoose Schema imported from ./models/
  const newUser = new User({
    username: req.body.username,
  });
  // if username taken, no good
  User.findOne({ username: newUser.username }).then((i) => {
    if (i) return res.send('username taken');
    // else save to db and return with _id and username
    newUser.save().then((i) => {
      const { _id, username } = i;
      return res.json({ _id, username });
    });
  });
});

app.get('/api/exercise/users/', (req, res) => {
  // return an array of all Users,
  // only include _id and username
  User.find({}, '_id username').then((users) => {
    return res.json(users);
  });
});

app.post('/api/exercise/add/', (req, res) => {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numberic',
  };
  let { userId, description, duration, date } = req.body;
  // check for required fields
  if (!userId || !description || !duration)
    return res.send('required fields missing');
  // check for required type
  if (isNaN(duration)) return res.send('duration must be a number in mins');
  // if no date, provide current date
  if (!date) {
    date = new Date().toDateString(options);
  }
  const newLog = { description, duration, date };
  // find current user
  User.findOne({ _id: userId })
    .then((user) => {
      user.log.push(newLog);
      user.count = user.log.length;
      // update db
      user.save().then(({ _id, username }) => {
        date = new Date(date).toDateString(options);
        return res.json({
          _id,
          username,
          description,
          duration: parseInt(duration),
          date,
        });
      });
    })
    // if userId invalid
    .catch((err) => res.send('invalid userId'));
});

app.get('/api/exercise/log', (req, res) => {
  let { userId, from, to } = req.query;
  const limit = parseInt(req.query.limit);
  const validDate = /^(\d{4}-\d{2}-\d{2})$/;
  if (from) {
    if (!from.match(validDate)) {
      return res.send('invalid "from" date');
    } else {
      from = new Date(from);
    }
  }
  if (to) {
    if (!to.match(validDate)) {
      return res.send('invalid "to" date');
    } else {
      to = new Date(to);
    }
  }
  // find current user
  User.findOne({ _id: userId })
    .then(({ _id, username, count, log }) => {
      const logTrimmed = [];
      log.some(({ description, duration, date }) => {
        if (limit && logTrimmed.length === limit) return true;
        date = new Date(date);
        if ((!from || date >= from) && (!to || date <= to)) {
          logTrimmed.push({ description, duration, date });
        }
      });
      return res.json({
        _id,
        username,
        count,
        log: logTrimmed,
      });
    })
    // if userId invalid
    .catch((err) => res.send('invalid userId'));
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
