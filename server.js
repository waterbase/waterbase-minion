var express = require('express');
var env = require('./env/env.js');
var ControllerSet = require('./config/ControllerSet.js');
var Sockets = require('./config/Socket');
require('./config/createDatabase.js')(function(databaseConnection){
  var controllers = new ControllerSet(databaseConnection);
  //creating express app
  var app = express();
  require('./config/middlewareMixin.js')(app);
  require('./config/routesMixin.js')(app, controllers);
  require('./config/adminRoutesMixin.js')(app);

  var io = new Sockets(databaseConnection, controllers);

  var server = app.listen(env.port, function () {
    console.log(' Server ++++++ Server started on', env.port);
  });

  io.listen(server);
});
