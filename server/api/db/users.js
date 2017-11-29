var knex = require('../services').knex;
var crypto = require('crypto');

var table = "users";

var users = {};

function generateId() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';

  var bytes = crypto.randomBytes(10);
  var objectId = '';
  for (var i = 0; i < bytes.length; ++i) {
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }

  return objectId;
}

users.insert = function (object) {
  object.id = generateId();
  object.created_at = new Date();
  return new Promise(function (resolve, reject) {
    knex(table).insert(object).then(function () {
      resolve(object.id);
    }).catch(function (err) {
      reject(err);
    });
  });
};

users.update = function (object) {
  object.updated_at = new Date();
  return new Promise(function (resolve, reject) {
    knex(table).update(object).where('id', object.id).then(function (res) {
      resolve(res);
    }).catch(function (err) {
      reject(err);
    });
  });
};

users.getByUsername = function (username) {
  return new Promise(function (resolve, reject) {
    knex.select('*').from(table).where('username', username).then(function (res) {
      resolve(res);
    }).catch(function (err) {
      reject(err);
    });
  });
};

users.getById = function (id, callback) {
  // var that = this;
  // knex(table).where('id', id).select().then(function (res) {
  //   console.log('response: ', res);
  // });
  // return new Promise(function (resolve, reject) {
  //   knex(table).where('id', id).then(function (res) {
  //     // console.log('response: ', res);
  //   });
  // console.log("id===" + JSON.stringify(id));
  id = id.data;
  // knex.select('*').from(table).where('id', `${id}`).then(function (res) {
  //   if (res.length > 0) {
  //     return resolve(res[0]);
  //   }
  //   resolve({});
  // }).catch(function (err) {
  //   reject(err);
  // });

  knex.select('*').from(table).where('id', `${id}`).then(function (res) {
    // console.log("res" + JSON.stringify(res));
    if (res.length > 0) {
      return callback(null, res[0]);
    }
  }).catch(function (err) {
    return callback(err, null);
  });
};

users.getAll = function () {
  return new Promise(function (resolve, reject) {
    knex.select('*').from(table).then(function (res) {
      resolve(res);
    }).catch(function (err) {
      reject(err);
    });
  });
};

module.exports = users;
