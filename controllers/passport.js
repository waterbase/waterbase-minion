module.exports = function(databaseConnection){
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var User = databaseConnection.model('user');

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, '-salt -hashedPassword', function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, {
            message: 'Your credential is incorrect.'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Your credential is incorrect.'
          });
        }
        return done(null, user);
      });
    }
  ));

  return passport;
}

