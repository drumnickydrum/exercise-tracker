const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const User = new mongoose.Schema({
  username: String,
  count: { type: Number, default: 0 },
  log: [
    {
      description: String,
      duration: Number,
      date: String,
    },
  ],
});
// User.plugin(AutoIncrement, { inc_field: 'count' });

module.exports = mongoose.model('user', User);
