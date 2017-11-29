const jwt = require('jsonwebtoken');
const usersController = require('../controllers/usersController');
const dotEnv = require('dotenv').config();

module.exports = function(request, response, next) {
  if (!request.headers.authorization) {
    return response.status(401).end();
  }

  const token = request.headers.authorization.split(' ')[1];

  return jwt.verify(token, process.env.jwtSecret, function(error, decoded) {
    if (error) {
      return response.status(401).end();
    }
    const userId = decoded.sub;
    // console.log('auth-check::jwt.verify::userId--> ', JSON.stringify(userId));

    return usersController
      .getById(userId)
      .then(function(user) {
        if (!user) {
          return repsonse.status(401).end();
        }
        return next();
      })
      .catch(function(error) {
        return response.status(401).end();
      });
  });
};
