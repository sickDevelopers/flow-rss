const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userFlowSchema = mongoose.Schema({
  user_id: {
        type: String,
        required: true
      },
  feeds: {
    type: Array,
    required: true
  },
  flow: {
        type: Object,
        required: true,
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
userFlowSchema.plugin(uniqueValidator);

userFlowSchema.methods.addFlow = function() {
  // find if url already added to flow
  console.log(this);
  return true;
}

module.exports = mongoose.model('UserFlow', userFlowSchema);
