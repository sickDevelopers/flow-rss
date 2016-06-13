"use strict";
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validUrl = require('valid-url');
const Feed = require('./feed');

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
  this.feeds = this.feeds.filter((feed) => {
    return feed !== url;
  })
  return this.save();
}

userFlowSchema.methods.hasFeed = function(url) {
  return this.feeds.find((feed) => {
    return feed === url;
  })
}

userFlowSchema.methods.buildDigest = function() {

  let promises = this.feeds.map((feed) => {
    if (validUrl.isUri(feed)) {
      return new Promise((resolve, reject) =>  {
        let feedQuery = Feed.findOne({
          url: feed
        });
        feedQuery.exec()
          .then((feedData) =>  {
            let articles = feedData.content[0].articles.map((articleData) => {
              return {
                author: articleData.author,
                description: articleData.description,
                date: articleData.date,
                summary: articleData.summary,
                origlink: articleData.origlink,
                title: articleData.title
              }
            })
            resolve(articles);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
    return null;
  });

  return Promise.all(promises)
    .then((data) => {
      return {
        message: data
      }
    })

}


module.exports = mongoose.model('UserFlow', userFlowSchema);
