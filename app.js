// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// BOOTSTRAP MODELS
var modelFiles = fs.readdirSync('models');
modelFiles.forEach(function(modelFile) {
  if (ctrlFile.indexOf('.js') === - 1) {
    return;
  }
  modelFile = ctrlFile.replace('.js', '');
  var model = require('./models/' + modelFile);
});

// BOOTSTRAP CONTROLLERS
var controllerFiles = fs.readdirSync('controllers');
controllerFiles.forEach(function(ctrlFile) {
  if (ctrlFile.indexOf('-controller.js') === - 1) {
    return;
  }
  ctrlFile = ctrlFile.replace('.js', '');
  var controller = require('./controllers/' + ctrlFile);
  controller.__init();
});


// test route to make sure everything is working
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

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
