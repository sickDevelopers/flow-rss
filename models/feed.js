const mongoose = require('mongoose');

const feedSchema = mongoose.Schema({
  name: String,
  url: String,
  content: Array,
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('Feed', feedSchema);
