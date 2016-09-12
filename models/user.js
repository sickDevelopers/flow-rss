const mongoose = require('mongoose'),
  request = require('request-promise'),
  uniqueValidator = require('mongoose-unique-validator'),
  Q = require('q');

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
  githubId: {}
});
userSchema.plugin(uniqueValidator);

userSchema.statics.createOauthUser = function(accessToken) {
  var self = this;
  return request({
      url: 'https://api.github.com/user',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'User-Agent': 'Flow-rss-app'
      }
    })
    .then(function(user) {
      user = JSON.parse(user);
      // find user in db
      return self.findOne({
          githubId: user.id
        })
        .then((localUser) => {
          if (localUser === null) {
            var newUser = new self({
              name: user.name,
              email: user.email,
              created_at: new Date().getTime(),
              updated_at: new Date().getTime(),
              githubId: user.id
            });
            return newUser.save();
          }
          // save user in session
          return localUser;
        });
    });

}

module.exports = mongoose.model('User', userSchema);
