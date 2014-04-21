 'use strict';
var auth = require('../controllers/authorize');
/**
 * Create user
 */
module.exports = function(app, databaseConnection, passport){
  var authService = require('../controllers/authService')(databaseConnection);

  app.post('/admin/user', function(req, res, next){
    console.log('ADMIN create user');
    authService.create(req.body, function(err, user){
      if (err) {
        console.log(err, req.body);
        return res.send(400, err);
      }
      passport.authenticate('local', function(err, user, info) {
        if (err || info) {
          console.log(err, info);
          return res.send(401);
        }
        console.log('user', user);
        req.logIn(user, function(err) {
          if (err){
            return res.send(500);
          } 
          res.send(201, {
            _id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            provider: req.user.provider
          });
        });
      })(req, res, next);
    });
  });

  app.get('/admin/user', auth, function(req, res){
    console.log('ADMIN get user');
    if (!req.user){
      return res.send(404);
    }
    authService.show(req.user._id, function(err, profile){
      if (err) {
        console.log(err);
        return res.send(500, err);
      } else if (!profile) {
        return res.send(404);
      }
      res.send(200, profile);
    })
  });


  app.put('/admin/user', auth, function(req, res){
    console.log('ADMIN update user');
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);
    authService.changePassword(userId, oldPass, newPass, function(err, authorized){
      if (err){
        console.log(err);
        return res.send(500);
      } else if (!authorized){
        return res.send(401);
      } else {
        return res.send(204);
      }
    });
  });

  //login and logout
  app.post('/admin/session', function(req, res, next){
    console.log('ADMIN login');
    passport.authenticate('local', function(err, user, info) {
      if (err || info) {
        console.log(err, info);
        return res.send(401);
      }
      console.log('user', user);
      req.logIn(user, function(err) {
        if (err){
          return res.send(500);
        } 
        res.send(201, {
          _id: req.user._id,
          email: req.user.email,
          role: req.user.role,
          provider: req.user.provider
        });
      });
    })(req, res, next);
  });
  
  app.del('/admin/session', function(req, res){
    console.log('ADMIN login');
    req.logout();
    res.send(204);
  });
}