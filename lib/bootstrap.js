const fs = require('fs');
const mongoose = require('mongoose');

const bootstrap = () => {

	// DB
	mongoose.connect(process.env.DATABASE_URL);

	// BOOTSTRAP CONTROLLERS
	var controllerFiles = fs.readdirSync('controllers');
	controllerFiles.forEach(function(ctrlFile) {
	  if (ctrlFile.indexOf('-controller.js') === - 1) {
	    return;
	  }
	  ctrlFile = ctrlFile.replace('.js', '');
	  var controller = require('../controllers/' + ctrlFile);
	  var instance = new controller();
	  instance.setup();
	});
}

module.exports = bootstrap;
