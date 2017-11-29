const express = require('express');
const jwt = require('jsonwebtoken');
const mailer = require('nodemailer');
const db = require('../api/db/index');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const dotenv = require('dotenv').config();
const passport = require('passport');
const validator = require('validator');

const usersController = require('../controllers').userController;

var hashPassword = function (password) {
  return new Promise(function (resolve, reject) {
    return bcrypt.hash(password, process.env.salt, null, function (err, hashedPassword) {
      if (err) return reject('error salting password: ' + err);
      return resolve(hashedPassword);
    });
  });
};

var master = {
  username: 'schld',
  password: 'admin',
  token: ''
};

function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.to !== 'string' || !validator.isEmail(payload.to)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Please provide your email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

var transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply@schoold.co',
    pass: process.env.noreply_pw
  }
});

router.post('/invitation/:token', function (req, res, next) {
  // console.log('POST /invitation/:token');
  // console.log('token --> ', req.params.token);
  // console.log('body token --> ', req.body.token);
  var idDecodedObject = jwt.decode(req.params.token);
  if (idDecodedObject) {
    var id = idDecodedObject.data;
    // console.log(id);
    return passport.authenticate('local-signup', function (request, response) {
      return res.status(200).json({
        success: true,
        message: 'You have successfully signed up!'
      });
    })(req, res, next);
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid token!'
    });
  }

  // singup.signup(req, res);
});

router.post('/invite', function (req, res, next) {
  var to, message;

  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  to = req.body.to;

  // console.log('/invite/to --> ', to);
  message = req.body.message;

  var newUser = {
    doc: {
      email: to,
    },
    username: to
  };
  usersController.create(newUser, req, res)
    .then(function (user) {
      token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: user.id
      }, process.env.jwtInviteSecret);
      const username = jwt.sign({
        data: to
      }, process.env.jwtInviteSecret);

      transporter.sendMail({
          from: 'SchooldBot <noreply@schoold.co>',
          to: 'adam@schoold.co',
          subject: 'ViewBook Dashboard Invitation',
          html: `<p><h1>Welcome to Schoold - ViewBook Dashboard!</h1><h2>Verify that ${to} is a valid email from a partner.</h2><h2>The link below will allow a partner to configure their user and create a new password.</h2></p><p><a href="http://172.31.48.191:3000/#/invitation/${token}/${username}">Configure Account Link</a></p>`
        }, function (error, info) {
          console.log(error);
          console.log(info);
          return res.send('ayy');
        }
      );
    })
    .catch(function (error) {
      if (error.dataValues) {
        return res.redirect('/');
      } else {
        console.error(error.message);
      }
    });
});

router.post('/login', function (req, res, next) {
  var username, password, token;
  var that = this;

  if (!req.body.username || !req.body.password) {
    console.log('failure!');
    return res.send('failure');
  }

  username = req.body.username;
  password = req.body.password;

  // check user logic
  /*  if (username === master.username && password === master.password) {
   console.log('master user!');
   token = jwt.sign({
   exp: Math.floor(Date.now() / 1000) + (60 * 60),
   data: 'master'
   }, 'some-master-key');
   return res.send(token)
   }

   return res.send('failure');*/
  return passport.authenticate('local-login', function (request, response) {
    if (request && request.name && request.name === "IncorrectCredentialsError") {
      return res.status(403).json({
        success: false,
        message: 'Incorrect Email or Password'
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'logged in!',
        token: response
      });
    }
  })(req, res, next);
});

router.get('/', function (req, res, next) {
  res.render('users', {title: 'Express'});
});

module.exports = router;
