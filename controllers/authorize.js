var upstreamManager = require('./upstreamManager');
module.exports = function (req, res, next) {
  var config = upstreamManager.serverConfig.resources[req.params.collection]; 
  if (!config){
    //new resources default to accessible by all
    return next();
  }

  var permissions = config.permissions;
  if (!permissions || !permissions[req.method]){
    //if no permissions exists it is accessible by all
    return next();
  }

  if (req.isAuthenticated() &&
    permissions.indexOf(req.user.role) > -1){
    return next();
  }

  console.log(req.url, 'intercepted by auth', req.user);
  res.send(401);
};