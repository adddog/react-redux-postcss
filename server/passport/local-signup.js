var users = require('../api/db/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const dotenv = require('dotenv').config();
const usersController = require('../controllers').userController;
const PassportLocalStrategy = require('passport-local').Strategy;

var hashPassword = function (password) {
  return new Promise(function (resolve, reject) {
    return bcrypt.hash(password, process.env.salt, null, function (err, hashedPassword) {
      if (err) return reject('error salting password: ' + err);
      return resolve(hashedPassword);
    });
  });
};

module.exports = new PassportLocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
  },
  (req, username, password, done) => {
    const userData = {
      username: username.trim(),
      password: password.trim()
    };

    var password = req.body.password;
    var token = req.params.token;
    var userId = jwt.decode(token, process.env.jwtInviteSecret);

    usersController.getById(userId)
      .then(function (user) {
        if (user) {
          var sessionToken = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: userId
          }, process.env.jwtPassSecret);
          hashPassword(password)
            .then(function (hashedPassword) {
              var updateObject = {
                hashed_password: hashedPassword,
                session_token: sessionToken
              };
              usersController.update(userId, updateObject)
                .then(function (rows) {
                  if (rows.length === 1) {
                    return done(null);
                  } else {
                    return done('no updated rows');
                  }
                })
                .catch(function (error) {
                  return done(error.message);
                });
            })
            .catch(function (error) {
              return done(error.message);
            });
        } else {
          var error = {};
          error.message = 'Unable to find a user with that id';
          return done(error);
        }
      })
      .catch(function (error) {
        return done(error.message);
      });
  });
/*exports.signup = function (req, res) {
 var password = req.body.password;
 var token = req.params.token;
 var userId = jwt.decode(token, process.env.jwtInviteSecret);

 var sessionToken = jwt.sign({
 exp: Math.floor(Date.now() / 1000) + (60 * 60),
 data: userId
 }, process.env.jwtPassSecret);

 usersController.getById(userId)
 .then(function (user) {
 console.log("signup user::" + JSON.stringify(user));

 if (user) {
 hashPassword(password).then(function (hashedPassword) {
 var updateObject = {
 hashed_password: hashedPassword,
 session_token: sessionToken
 };

 console.log("hashPassword::" + hashedPassword);
 console.log("session_token::" + sessionToken);

 usersController.update(userId, updateObject).then(function (newUserRes) {

 // save the passport
 // req.user.logIn(newUserRes);
 return res.status(200).json({
 status: 200,
 })
 })
 }).catch(function (e) {
 console.log('signup error::' + e);
 return res.status(500).json({
 status: 500
 })
 });
 } else {
 return res.status(500).json({
 status: 500
 })
 }
 }).catch(function (error) {
 return res.status(500).json({
 status: 500,
 message: error
 });
 */




