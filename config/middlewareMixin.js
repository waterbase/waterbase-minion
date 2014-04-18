/* global require, module */
var express = require('express');
var passport = require('passport');
var mongoStore = require('connect-mongo')(express);
var env = require('../env/env');

var accessRoles = {

};

module.exports = function(app, databaseUri) {
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.bodyParser());

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

  // Persist sessions with mongoStore
  console.log('creating session ', databaseUri);
  app.use(express.session({
    secret: '#$%&^5yrthgrjh0845%^&4534fds',
    store: new mongoStore({
      url: databaseUri,
      collection: 'sessions'
    }, function () {
        console.log("session store connection open");
    })
  }));

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());
};
