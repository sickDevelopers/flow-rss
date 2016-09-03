// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');        // call express
const app = module.exports = express();// define our app using expresssll
var db = require('./lib/db');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/api', router);

// allow cross domain requests
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


var port = process.env.PORT || 8080;        // set our port

// BOOTSTRAP
require('./lib/bootstrap')();


// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Magic happens on port " + port);
