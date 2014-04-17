var request = require('request');
var env = require('../env/env.js');

var manager = {};
var serverConfig;

manager.getConfig = function(callback){  
  request.get(env.masterUrl, function(err, upstreamServerConfig){
    serverConfig = upstreamServerConfig;
    if (!serverConfig){
      serverConfig = {
        name: 'empty',
        resources: {}
      }
    }
    callback(serverConfig);
  })
}

manager.createResource = function(name, resource){
  request.post(env.masterUrl+'/'+serverConfig._id, {
    name: name,
    attributes: resource
  }, function(err, resources){
    if (err){
      console.log('ERROR', err);
    }
  })
}

manager.updateResource = function(name, resource){
  request.put(env.masterUrl+'/'+serverConfig._id, {
    name: name,
    attributes: resource
  }, function(err, resources){
    if (err){
      console.log('ERROR', err);
    }
  })
}

module.exports = manager;