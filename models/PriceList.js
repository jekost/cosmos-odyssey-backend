const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Travel = require('./Travel'); // Import Travel model

const PriceList = sequelize.define('PriceList', {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    validUntil: { type: DataTypes.DATE, allowNull: false }
});

// Define One-to-Many relationship
PriceList.hasMany(Travel, { foreignKey: 'priceListId', onDelete: 'CASCADE' });
Travel.belongsTo(PriceList, { foreignKey: 'priceListId' });

module.exports = PriceList;
