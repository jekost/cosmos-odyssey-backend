const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Planet = sequelize.define('Planet', {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Planet;
