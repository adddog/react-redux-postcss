"use strict";
var crypto = require('crypto');
const Users = require('../models/index').users;
const bcrypt = require('bcrypt-nodejs');
const dotenv = require('dotenv').config();

var controller = {};

function generateId() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';

  var bytes = crypto.randomBytes(10);
  var objectId = '';
  for (var i = 0; i < bytes.length; ++i) {
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }

  return objectId;
}

var hashPassword = function (password) {
  return new Promise(function (resolve, reject) {
    return bcrypt.hash(password, process.env.salt, null, function (error, hashedPassword) {
      if (error) {
        return reject('error salting password: ', error);
      }
      return resolve(hashedPassword);
    });
  });
};

controller.compareHashedPassword = function (username, password, callback) {
  controller.getByUsername(username)
    .then(function (user) {
      if (user[0]) {
        bcrypt.compare(password, user[0].hashed_password, callback);
      } else {
        return false;
      }
    })
    .catch(function (error) {
      return false;
    });
};

controller.create = function (user, req, res) {
  user.id = generateId();
  user.created_at = new Date();
  return new Promise(function (resolve, reject) {
    Users
      .findOrCreate({
        where: {doc: user.doc},
        defaults: {
          username: user.username,
          id: user.id,
          doc: user.doc,
          created_at: user.created_at,
          updated_at: user.created_at
        }
      })
      .then(function (user, created) {
        var userObject = user[0];
        var isCreated = user[1];
        if (isCreated === true) {
          resolve(userObject);
        } else {
          reject(userObject);
        }
      })
      .catch(function (error) {
        console.log('error occurred: ', error);
        reject(error);
      });
  });
};

controller.getById = function (id) {
  if (id.data) {
    id = id.data;
  }
  return new Promise(function (resolve, reject) {
    Users.findAll({where: {id: id}})
      .then(function (user) {
        if (user) {
          return resolve(user);
        } else {
          return reject({});
        }
      })
      .catch(function (error) {
        console.log('error occurred: ', error);
        return reject(error);
      });
  });
};

controller.getByUsername = function (username) {
  // console.log('controller::getByUsername::username--> ', JSON.stringify(username));
  return new Promise(function (resolve, reject) {
    Users.findAll({where: {username: username}})
      .then(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject({});
        }
      })
      .catch(function (error) {
        console.log('controller::getByUsername::error --> ', error);
        reject(error);
      });
  });
};

controller.update = function (id, updateObject) {
  // console.log("controller::update:id: ", JSON.stringify(id));
  //If jwt object, cast as data element.
  if (id.data) {
    id = id.data;
  }
  return new Promise(function (resolve, reject) {
    Users.update(updateObject, {where: {id: id}})
      .then(function (rowCount) {
        return resolve(rowCount);
      })
      .catch(function (error) {
        console.log('controller:update:update: ', error);
        return reject({});
      });
  });
};


module.exports = controller;
