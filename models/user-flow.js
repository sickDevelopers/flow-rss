"use strict";
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validUrl = require('valid-url');
const Feed = require('./feed');
const User = require('./user');
const mailer = require('../helpers/mailer');
const RssParser = require('../helpers/feedparser');

const userFlowSchema = mongoose.Schema({
  user_id: {
        type: String,
        required: true
      },
  feeds: {
    type: Array
  },
  send_interval : {
    type: String
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
  let self = this;
  if(this.hasFeed(url)) {
    throw "Feed already added";
  }
  if (!validUrl.isUri(url)) {
    throw "Invalid URL";
  }

  // TODO: check if feed exists in database
  // if not, add to database
  let feedData = {
    url: url
  };
  feedData.created_at = new Date();
  feedData.updated_at = new Date();
  let newFeed = new Feed(feedData);

  return RssParser.parse(newFeed.url)
    .then((data) => {
      newFeed.content = data;
      newFeed.name = data.title;
      return newFeed;
    })
    .then((feed) => {
      console.log('saving feed...');
      return newFeed.save();
    })
    .then((result) => {
      self.feeds.push(url);
      return self.save();
    })

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
  let self = this;
  // retreive all the articles in the feeds from db
  let promises = this.feeds.map((feed) => {
    if (validUrl.isUri(feed)) {
      return new Promise((resolve, reject) =>  {
        let feedQuery = Feed.findOne({
          url: feed
        });
        feedQuery.exec()
          .then((feedData) =>  {
            // map articles to simpler objects
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
            // fliter articles, returns only articles after last update
            .filter((article) => {
              let update_date = new Date(self.updated_at);
              return article.date > update_date;
            });

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
      // cut out falsy values
      data = data.filter((el) => { return el });
      let content = new Array().concat(...data)
        // sort by date
        .sort((a, b) => {
          return new Date(a.date) < new Date(b.date);
        });
      self.flow = content;
      self.updated_at = new Date();
      return self.save();
    })

}

userFlowSchema.methods.send = function() {
  var self = this;
  return User.findById(this.user_id)
    .then((user) => {
      return mailer.prepareMailTemplate(user, self)
    })
    .then((template) => {
      return mailer.send(template);
    });
}

userFlowSchema.methods.preview = function() {
  var self = this;
  return User.findById(this.user_id)
    .then((user) => {
      return mailer.prepareMailTemplate(user, self)
    });
}


module.exports = mongoose.model('UserFlow', userFlowSchema);
