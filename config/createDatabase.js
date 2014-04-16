var mongoose = require('mongoose');
var env = require('../env/env.js');
var serverManager = require('../manage/serverManager.js');

module.exports = function(callback){
  serverManager.getConfig(function(serverConfig){
    var databaseConnection = mongoose.createConnection(
      env.mongoHost + serverConfig.name,
      { db: { safe:true } });

    databaseConnection.once('open', function(){
      var resources = serverConfig.resources;

      console.log(' Server ++++++ database connection opened ');

      for (var resourceName in resources.attributes){
        databaseConnection.model(resourceName, resources.attributes[resourceName]);
      }

      callback(databaseConnection);
    });
  });
}