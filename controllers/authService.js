var mongoose = require('mongoose');
var passport = require('passport');

module.exports = function(databaseConnection){
  var User = databaseConnection.model('user');
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
        _id: user._id,
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

  return service;
};