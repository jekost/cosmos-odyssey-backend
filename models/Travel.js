const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Travel = sequelize.define('Travel', {
    offerId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    priceListId: { type: DataTypes.UUID, allowNull: false },
    legId: { type: DataTypes.UUID, allowNull: false },
    companyId: { type: DataTypes.UUID, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    flightStart: { type: DataTypes.DATE, allowNull: false },
    flightEnd: { type: DataTypes.DATE, allowNull: false },
    flightDuration: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = Travel;
