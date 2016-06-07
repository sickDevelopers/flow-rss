var fs = require('fs');

module.exports = function bootstrap(app, params) {
	// BOOTSTRAP CONTROLLERS
	var controllerFiles = fs.readdirSync('controllers');
	controllerFiles.forEach(function(ctrlFile) {
	  if (ctrlFile.indexOf('-controller.js') === - 1) {
	    return;
	  }
	  ctrlFile = ctrlFile.replace('.js', '');
	  var controller = require('../controllers/' + ctrlFile);
	  console.log(controller);
	  var instance = new controller();
	  instance.setup();
	});
}
