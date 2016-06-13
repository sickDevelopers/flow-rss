"use strict";
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validUrl = require('valid-url');

const userFlowSchema = mongoose.Schema({
  user_id: {
        type: String,
        required: true
      },
  feeds: {
    type: Array
  },
  flow: {
        type: Object,
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

userFlowSchema.methods.addFeed = function(url) {
  if(this.hasFeed(url)) {
    throw "Feed already added";
  }
  if (!validUrl.isUri(url)) {
    throw "Invalid URL";
  }
  this.feeds.push(url);
  return this.save();
}

userFlowSchema.methods.deleteFeed = function(url) {
  this.feeds = this.feeds.filter(function(feed) {
    return feed !== url;
  })
  return this.save();
}

userFlowSchema.methods.hasFeed = function(url) {
  return this.feeds.find(function(feed) {
    return feed === url;
  })
}

userFlowSchema.methods.buildDigest = function() {

  let promises = this.feeds.map(function(feed) {
    if (validUrl.isUri(feed) {
      return new Promise(function(resolve, reject) {
        let feedQuery = Feed.find({
          url: feed
        });
        feedQuery.exec()
          .then(function(feedData) {
            resolve(feedData.name);
          }
      });
    }
  });

  return Promise.all(promises)
    .then(function() {
      return {
        message: "Done";
      }
    })

}


module.exports = mongoose.model('UserFlow', userFlowSchema);
