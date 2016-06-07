// var Feed = require('../models/Feed.js');
"use strict";
const app = require('../app');
const router = app.Router();              // get an instance of the express Router



const FeedController = function FeedController () {

}

FeedController.prototype = {
  setup: function() {
  	console.log('setup FeedController routes...');
    router.get('/', function(req, res) {
      res.json({ message: 'hooray! welcome to our api!' });
    });
  }
}


module.exports = FeedController;
