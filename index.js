const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

// require('./server/models').connect(process.env.db);

const app = express();
//TODO: DEV
app.use(cors())
// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
//TODO: Maybe remove
app.use(bodyParser.json());
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({extended: false}));
//Pass the passport middleware to express
app.use(passport.initialize());

//load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

//Load and pass in the middleware auth
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth');
const userRoutes = require('./server/routes/users');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api', apiRoutes);

// start the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000 or http://127.0.0.1:4000');
});

