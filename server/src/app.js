require('newrelic');

var express = require('express');
var path = require('path');
var env = process.env.NODE_ENV || 'development';

var config = require('./config/config')(env);

// Configure the server so we can pass it to the controllers.
var app = express();

// Load and setup the controllers.
app.use(express.static(path.normalize(config.dirs.staticFiles), {default: 'index.html'}));

// Start the server.
var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server running on port %d in %s mode", port, env);
});