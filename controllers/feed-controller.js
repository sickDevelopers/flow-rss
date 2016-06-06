// var Feed = require('../models/Feed.js');
"use strict";
const express    = require('express');        // call express
const app        = express();
const router = express.Router();              // get an instance of the express Router


const FeedController = function FeedController () {

}

FeedController.prototype = {
  setup: function() {
    router.get('/', function(req, res) {
      res.json({ message: 'hooray! welcome to our api!' });
    });
  }
}


module.exports = FeedController;
