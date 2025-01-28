const Sequelize = require('sequelize');
const db = require('../config/db');
const User = require('./User');

// Initialize Sequelize
const sequelize = db;

// Add models to Sequelize
const models = {
  User,
};

// Associate models (if there are relationships)
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export Sequelize and models
module.exports = { sequelize, Sequelize, ...models };
