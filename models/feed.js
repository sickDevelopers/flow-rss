const mongoose = require('mongoose');

const feedSchema = mongoose.Schema({
  name: {
        type: String,
        required: true
      },
  url: {
        type: String,
        required: true
      },
  content: {
        type: Array,
        required: true
      },
  created_at: {
        type: Date,
        required: true
      },
  updated_at: {
        type: Date,
        required: true
      }
});

module.exports = mongoose.model('Feed', feedSchema);
