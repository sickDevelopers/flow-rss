const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const feedSchema = mongoose.Schema({
  name: {
        type: String,
        required: true
      },
  url: {
        type: String,
        required: true,
        unique: true
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
feedSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Feed', feedSchema);
