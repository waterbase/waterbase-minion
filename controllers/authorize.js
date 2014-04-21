var upstreamManager = require('./upstreamManager');

var actionType = function(method){
  return method.toUpperCase() === 'GET'? 'read' : 'write';
}

var canAccess = function(req){
  var resource = upstreamManager.serverConfig.resources[req.params.collection];
  
  if( !resource || 
      !resource.permissions || 
      !resource.permissions[actionType(req.method)]){
    console.log(' ~~~~~~ no defined permissions', req.params.collection);
    return true;
  }

  var group = resource.permissions[actionType(req.method)];

  if( !req.isAuthenticated() && 
      !~group.indexOf('guest')){
    return false;
  }

  return req.isAuthenticated() && req.user && 
    ~group.indexOf(req.user.role);
}

var isAdminOnly = function(collection){
  return ~['user', 'users', 'session', 'sessions'].indexOf(collection);
}

var isAdmin = function(user){
  return !user || user.role !== 'admin';
}

var denied = function(res){
  return res.send(401);
}

module.exports = function (req, res, next) {
  console.log(' ~~~~~~ authorizing ', req.user, 'for', req.params.collection);

  if (isAdminOnly(req.params.collection) && !isAdmin(req.user)){
    return denied(res);
  }

  if (!canAccess(req)){
    return denied(res);
  }

  return next();
};