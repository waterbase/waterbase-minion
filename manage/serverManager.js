var request = require('request');
var env = require('../env/env.js');

var manager = {};
var serverConfig;

manager.getConfig = function(callback){  
  request.get(env.masterUrl, function(err, upstreamServerConfig){
    serverConfig = upstreamServerConfig;
    if (!serverConfig){
      serverConfig = {
        name: 'testing',
        resources: {

        }
      }
    }
    callback(serverConfig);
  })
}

manager.createResource = function(name, resource){
  return;
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
  return;
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