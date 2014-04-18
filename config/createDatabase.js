var mongoose = require('mongoose');
var env = require('../env/env.js');

module.exports = function(serverConfig, callback){
  console.log('~~~~~~ connecting to', serverConfig);
  var databaseUri = serverConfig.databaseUri;
  console.log('actual', databaseUri);
  var databaseConnection = mongoose.createConnection(databaseUri, { 
    db: { safe:true } 
  });

  console.log(' oooooo waiting for database opening ', databaseUri);

  databaseConnection.once('open', function(){
    var resources = serverConfig.resources;

    console.log('++++++ database connection opened ');
    
    databaseConnection.model('user', require('../models/User'));

    for (var resourceName in resources){
      if (resourceName !== 'User'){
        console.log('@@@@@@ model', resourceName, resources[resourceName].attributes);
        databaseConnection.model(resourceName, resources[resourceName].attributes);
      }
    }

    console.log('db init completed', 
      Object.keys(databaseConnection.models), 
      Object.keys(databaseConnection.collections));

    callback(databaseConnection, databaseUri);
  });
}