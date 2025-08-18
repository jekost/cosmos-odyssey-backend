const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Leg = sequelize.define('Leg', {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    fromId: { type: DataTypes.UUID, allowNull: false },
    toId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    distance: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = Leg;
