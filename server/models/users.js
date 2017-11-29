'use strict';

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    username: DataTypes.STRING,
    hashed_password: DataTypes.STRING,
    session_token: DataTypes.STRING,
    doc: DataTypes.JSONB,
    createdAt: {
      type: DataTypes.TIME,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.TIME,
      field: 'updated_at'
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Users;
};
