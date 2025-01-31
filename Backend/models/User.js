const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('SuperAdmin', 'Admin', 'User'),
    defaultValue: 'User',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

});

module.exports = User;
