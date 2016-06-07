// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app = module.exports = express();         // define our app using express

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/api', router);

var port = process.env.PORT || 8080;        // set our port

// BOOTSTRAP
require('./lib/bootstrap')(app);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

mongoose.connect('mongodb://127.0.0.1:27017/');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected...');
});
