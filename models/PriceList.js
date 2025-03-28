const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PriceList = sequelize.define('PriceList', {
    validUntil: { type: DataTypes.DATE, allowNull: false },
    id: { type: DataTypes.UUID, allowNull: false, primaryKey : true}
});

module.exports = PriceList;
