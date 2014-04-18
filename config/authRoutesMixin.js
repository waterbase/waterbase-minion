 'use strict';

/**
 * Create user
 */
module.exports = function(app, databaseConnection){
  var authService = require('../controllers/authService')(databaseConnection);

  app.post('/api/user', function(req, res){
    authService.create(req.body, function(err, user){
      if (err) {
        console.log(err, req.body);
        return res.send(400, err);
      }
      authService.login(user, function(err, profile){
        if (err) {
          console.log(err);
          return res.send(500, err);
        }
        res.send(profile);
      })
    })
  });

  app.get('/api/user/:id', function(req, res){
    authService.show(req.params.id, function(err, profile){
      if (err) {
        console.log(err);
        return res.send(500, err);
      } else if (!profile) {
        return res.send(404);
      }
      res.send(200, profile);
    })
  });


  app.put('/api/user', function(req, res){
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
  app.post('/api/session', function(req, res, next){
    authService.login(req, res, next, function(err, authorized, data){
      if (err){
        console.log(err);
        return res.send(500);
      } else if (!authorized){
        return res.send(401);
      }
      res.send(201, data);
    })
  });
  
  app.del('/api/session', function(req, res){
    req.logout();
    res.send(204);
  });
}
