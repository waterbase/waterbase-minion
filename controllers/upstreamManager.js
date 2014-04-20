var request = require('request');
var env = require('../env/env.js');

var manager = {};

manager.serverConfig = {
  name: 'testing1',
  resources: {

  }
};

manager.getPermissions = function(){
  return manager.serverConfig.resources;
}

manager.getConfig = function(callback){  
  request.get(env.masterUrl+'/'+process.env.SERVER_ID, function(err, res, upstreamServerConfig){
    upstreamServerConfig = JSON.parse(upstreamServerConfig);
    if (!err && res.statusCode === 200){
      manager.serverConfig = upstreamServerConfig || manager.serverConfig;
    } else {
      console.log('error:', err, res.statusCode, 'config:', upstreamServerConfig);
    }
    callback(manager.serverConfig);
  });
}

manager.createResource = function(name, resource){
  request.post({
    url: env.masterUrl+'/'+process.env.SERVER_ID, 
    json: {
      name: name,
      attributes: resource
    }
  }, function(err, resources){
    if (err){
      console.log('ERROR', err);
    }
  })
}

manager.updateResource = function(name, resource){
  request.put({
    url: env.masterUrl+'/'+process.env.SERVER_ID,
    json {
      name: name,
      attributes: resource
    }
  }, function(err, resources){
    if (err){
      console.log('ERROR', err);
    }
  })
}

module.exports = manager;