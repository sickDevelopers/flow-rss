"use strict";
var express = require('express');
var app = require('../app');
var Feed = require('../models/feed');

const router = express.Router();

const FeedController = function FeedController () {}

FeedController.prototype = {
  setup: function() {
  	console.log('setup FeedController routes...');
    // LISTING
    router.get('/', function(req, res) {
      this.list(req, res);
    }.bind(this));
    // GET
    router.get('/:id', function(req, res) {
      this.list(req, res);
    }.bind(this));
    // ADD
    router.post('/', function(req, res) {
      this.create(req, res);
    }.bind(this));
  },
  list: function(req, res) {
    Feed.find().then(function(data) {
      res.json(data);
    })

  },
  create: function(req, res) {
    var feedData = req.body;
    feedData.created_at = new Date();
    feedData.updated_at = new Date();
    var newFeed = new Feed(feedData);
    newFeed.save()
      .then(function(result) {
        res.json({ message: result });
      })
      .catch(function(error) {
        res.json({ error: error });
      })

  }
}

app.use('/feeds', router);
module.exports = FeedController;
