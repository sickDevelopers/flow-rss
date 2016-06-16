"use strict";
const express = require('express');
const app = require('../app');
const Feed = require('../models/feed');
const RssParser = require('../helpers/feedparser');

const router = express.Router();

const FeedController = function FeedController () {}

FeedController.prototype = {

  setup: function () {
  	console.log('setup FeedController routes...');
    // LISTING
    router.get('/', ((req, res) => {
      this.list(req, res);
    }).bind(this));
    // GET
    router.get('/:id', ((req, res) => {
      this.list(req, res);
    }).bind(this));
    // ADD
    router.post('/', ((req, res) => {
      this.create(req, res);
    }).bind(this));
    // UPDATE
    router.get('/:id/update', ((req,res) => {
      this.update(req, res);
    }).bind(this))
  },

  list: (req, res) => {
    Feed.find().then((data) => {
      res.json(data);
    })
  },

  create: function (req, res) {
    let feedData = req.body;
    feedData.created_at = new Date();
    feedData.updated_at = new Date();
    let newFeed = new Feed(feedData);

    RssParser.parse(newFeed.url)
      .then((data) => {
        newFeed.content = data;
        newFeed.name = data.title;
        return newFeed;
      })
      .then((feed) => {
        console.log('saving...');
        return newFeed.save();
      })
      .then((result) => {
        res.json({ message: result });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  },

  update: function(req, res) {
    Feed.findById(req.params.id)
      .then((feed) => {
        return feed.updateArticles();
      })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json({error: error});
      })
  }

}

app.use('/feeds', router);
module.exports = FeedController;
