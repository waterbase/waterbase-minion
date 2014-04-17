/* global require, module */
var express = require('express');

var accessRoles = {

};

module.exports = function(app) {
  app.use(express.bodyParser());

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

  // app.use(function(req, res, next){
  //   var collection = req.params.collection;
  //   if (accessRoles[collection] && 
  //     accessRoles[collection][req.method]){
  //     //requires auth
  //     var allowedRoles = accessRoles[collection][req.method];
  //     if (allowedRoles.indexOf(req.user.role) > -1){
  //       next();
  //     } else {
  //       res.send(401, 'not authorzed for this method/resource');
  //     }
  //   } else {
  //     //do not require auth
  //     next();
  //   }
  // });
};
