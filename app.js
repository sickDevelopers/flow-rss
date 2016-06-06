// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var router = express.Router();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', router);

var port = process.env.PORT || 8080;        // set our port

// BOOTSTRAP CONTROLLERS
var controllerFiles = fs.readdirSync('controllers');
controllerFiles.forEach(function(ctrlFile) {
  if (ctrlFile.indexOf('-controller.js') === - 1) {
    return;
  }
  ctrlFile = ctrlFile.replace('.js', '');
  var controller = require('./controllers/' + ctrlFile);
  console.log(controller);
  var instance = new controller();
  instance.setup();
});



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
