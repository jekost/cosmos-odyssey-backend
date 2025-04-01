const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PriceList = sequelize.define('PriceList', {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    validUntil: { type: DataTypes.DATE, allowNull: false }
});


module.exports = PriceList;
