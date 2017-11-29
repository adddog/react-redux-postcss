const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const usersController = require('../controllers/usersController');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, username, password, done) => {
  const userData = {
    username: username.trim(),
    password: password.trim()
  };

  return usersController.getByUsername(username)
    .then(function (userRow) {
      var user = userRow[0];
      if (!user) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';
        return done(error);
      }
      usersController.compareHashedPassword(username, password, function (error, isMatch) {
        // console.log('local-login::usersController::compareHashedPassword::isMatch--> ', isMatch);
        if (error) {
          return done(error);
        }
        if (!isMatch) {
          const error = new Error('Incorrect email or password');
          error.name = 'IncorrectCredentialsError';
          return done(error);
        }

        const payload = {
          sub: user.id
        };

        const token = jwt.sign(payload, process.env.jwtSecret);
        const data = {
          username: user.username,
          id: user.id,
          doc: user.doc
        };
        return done(null, token, data);
      });
    })
    .catch(function (error) {
      return done(error);
    });
});
/*return Users.findAll({where: {username: userData.username}})
 .then(function (user) {
 if (!user) {
 const error = new Error('Incorrect email or password');
 error.name = 'IncorrectCredentialsError';
 return done(error);
 }
 return user.compare
 })
 .catch(function (error) {
 return done(error);
 });*/
