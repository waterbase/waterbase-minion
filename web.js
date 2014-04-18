var express = require('express');
var env = require('./env/env.js');
var ControllerSet = require('./controllers/ControllerSet.js');
var Sockets = require('./config/Socket');
var upstreamManager = require('./controllers/upstreamManager.js');

upstreamManager.getConfig(function(serverConfig){
  console.log('serverConfig retrieved', serverConfig);
  require('./config/createDatabase.js')(serverConfig, function(databaseConnection, databaseUri){
    var controllers = new ControllerSet(databaseConnection);
    var passport = require('./controllers/passport')(databaseConnection);
    //creating express app
    var app = express();
    require('./config/middlewareMixin.js')(app, databaseUri, passport);
    require('./config/authRoutesMixin.js')(app, databaseConnection);
    require('./config/routesMixin.js')(app, controllers);

    var io = new Sockets(databaseConnection, controllers);

    var server = app.listen(env.port, function () {
      console.log(' Server ++++++ Server started on', env.port);
    });

    io.listen(server);

    module.exports.server = server;
  });
});
