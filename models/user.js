const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const User = new mongoose.Schema({
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});
User.plugin(AutoIncrement, { inc_field: 'count' });

module.exports = mongoose.model('user', User);
