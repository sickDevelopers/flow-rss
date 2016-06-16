"use strict";
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const RssParser = require('../helpers/feedparser');

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

feedSchema.methods.updateArticles = function() {
  let self = this;
  return RssParser.parse(this.url)
    .then(function(feedData) {
      console.log('COMPARING');

      let oldArticles = self.content[0].articles.sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) {
          return -1;
        }
        if (new Date(a.date) < new Date(b.date)) {
          return 1;
        }
        return 0;
      });
      let lastArticleDate = oldArticles[0].date;
      console.log(lastArticleDate);

      // filter to get only new articles
      let newArticles = feedData.articles.filter((article) => {
        return new Date(article.date) > new Date(lastArticleDate);
      });

      console.log(newArticles.length)
      console.log("Lenght before", self.content[0].articles.length);
      self.content[0].articles.push(...newArticles);
      console.log("Lenght after", self.content[0].articles.length);

      return Feed.findOneAndUpdate({
        _id: self._id
      }, {
        'content.0.articles': self.content[0].articles
      }, function(err, data) {
        if(err) {
          console.log(err);
        }
        console.log(data);
      })

      // return self.update()
      //   .then((newFeed) => {
      //     console.log('Feed saved');
      //     return newArticles;
      //   });
    })
}

module.exports = mongoose.model('Feed', feedSchema);
