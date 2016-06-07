const mongoose = require('mongoose');

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('Connected...');
});


module.exports = mongoose.connection;
