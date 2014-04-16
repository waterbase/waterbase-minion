var request = require('request');
var env = require('../env/env.js');

var manager = {};

manager.getConfig = function(callback){  
  callback({
    name: 'living',
    resources: {
      animal:{
        attributes: {
          name: 'String',
          type: 'String'
        }
      }
    }
  })

  return;
  request.get(env.masterUrl, function(err, resources){
    calback(resources);
  })
}

manager.createResource = function(name, resource){
  console.log('create resource');
  return;
  request.post(env.masterUrl, {
    name: name,
    attributes: resource
  }, function(err, resources){
    calback(resources);
  })
}

manager.updateResource = function(name, resource){
  console.log('update resource');
  return;
  request.put(env.masterUrl, {
    name: name,
    attributes: resource
  }, function(err, resources){
    calback(resources);
  })
}

module.exports = manager;