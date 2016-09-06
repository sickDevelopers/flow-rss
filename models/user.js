const mongoose = require('mongoose')
  , request = require('request-promise')
  , uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    },
    oauth2: {
        github: mongoose.Schema.Types.Mixed
    }
});
userSchema.plugin(uniqueValidator);

userSchema.methods.createOauthUser = function(accessToken) {
  var self = this;

  request({
      url: 'https://www.github.com/user',
      auth: {
        'bearer': accessToken
      }
    })
    .then(function(err, response) {
      if (err) {
        console.log(err);
      }
      console.log(response);
    });

}

module.exports = mongoose.model('User', userSchema);
