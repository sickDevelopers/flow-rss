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

      // filter to get only new articles
      let newArticles = feedData.articles.filter((article) => {
        return new Date(article.date) > new Date(lastArticleDate);
      });

      // deep copy to update entire content
      let newArticlesCopy = JSON.parse(JSON.stringify(self.content[0].articles.concat(newArticles)));

      self.content = new Array(newArticlesCopy);
      return self.save();

    })
}

module.exports = mongoose.model('Feed', feedSchema);
