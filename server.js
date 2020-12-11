const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/exercise/new-user/', (req, res) => {
  console.log(req);
  res.end();
});

app.get('/api/exercise/users/', (req, res) => {
  console.log(req);
  res.end();
});

app.post('/api/exercise/add/', (req, res) => {
  console.log(req);
  res.end();
});

app.get('/api/exercise/log/', (req, res) => {
  console.log(req);
  res.end();
});

app.get('/api/exercise/log/:id/:from?/:to?/:limit?/', (req, res) => {
  console.log(req.params);
  res.end();
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
