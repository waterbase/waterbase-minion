var mongoose = require('mongoose');
var passport = require('passport');

module.exports = function(databaseConnection){
  var service = {};
  service.create = function (info, callback) {
    var newUser = new User(info);
    newUser.provider = 'local';
    newUser.save(function(err) {
      callback(err, newUser);
    });
  };

  service.show = function (userId, callback) {
    User.findById(userId, function (err, user) {
      if (err || !user) {
        return callback(err, null);
      }
      callback(null, {
        id: user._id,
        email: user.email,
        role: user.role,
        provider: user.provider
      });
    });
  };

  service.changePassword = function(userId, oldPass, newPass, callback) {
    User.findById(userId, function (err, user) {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        user.save(function(err) {
          callback(err, true);
        });
      } else {
        callback(null, false);
      }
    });
  };

  service.login = function (req, callback) {
    passport.authenticate('local', function(err, user, info) {
      if (error || info) {
        callback(err, !info)
      }
      req.logIn(user, function(err) {
        if (err) {
          return callback(err);
        }
        callback(null, true, {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role,
          provider: req.user.provider
        });
      });
    })(req, res, next);
  };

  return service;
};