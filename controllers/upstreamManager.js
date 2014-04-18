var request = require('request');
var env = require('../env/env.js');

var manager = {};

manager.serverConfig = {
  name: 'testing',
  resources: {

  }
};

manager.getPermissions = function(){
  return manager.serverConfig.resources;
}

manager.getConfig = function(callback){  
  request.get(env.masterUrl+'/'+process.env.SERVER_ID, function(err, res, upstreamServerConfig){
    if (!err && res.statusCode === 200){
      manager.serverConfig = upstreamServerConfig || manager.serverConfig;
    } else {
      console.log('error:', err, res.statusCode, 'config:', upstreamServerConfig);
    }
    callback(manager.serverConfig);
  })
}

manager.createResource = function(name, resource){
  request.post(env.masterUrl+'/'+process.env.SERVER_ID, {
    name: name,
    attributes: resource
  }, function(err, resources){
    if (err){
      console.log('ERROR', err);
    }
  })
}

manager.updateResource = function(name, resource){
  request.put(env.masterUrl+'/'+process.env.SERVER_ID, {
    name: name,
    attributes: resource
  }, function(err, resources){
    if (err){
      console.log('ERROR', err);
    }
  })
}

module.exports = manager;