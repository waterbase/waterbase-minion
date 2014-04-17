var mongoose = require('mongoose');
var env = require('../env/env.js');
var serverManager = require('../manage/serverManager.js');

module.exports = function(callback){
  serverManager.getConfig(function(serverConfig){
    console.log('>>>>>> retrieed serverConfig', serverConfig);
    var databaseConnection = mongoose.createConnection(
      env.mongoHost + serverConfig.name,
      { db: { safe:true } });

    databaseConnection.once('open', function(){
      var resources = serverConfig.resources;

      console.log('++++++ database connection opened ');

      for (var resourceName in resources){
        console.log('@@@@@@ model', resourceName, resources[resourceName].attributes);
        databaseConnection.model(resourceName, resources[resourceName].attributes);
      }

      callback(databaseConnection);
    });
  });
}