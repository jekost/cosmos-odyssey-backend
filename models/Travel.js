const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Travel = sequelize.define('Travel', {
    offerId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    priceListId: { type: DataTypes.UUID, allowNull: false },
    validUntil: { type: DataTypes.DATE, allowNull: false },
    legId: { type: DataTypes.STRING, allowNull: false },
    fromId: { type: DataTypes.STRING, allowNull: false },
    fromName: { type: DataTypes.STRING, allowNull: false },
    toId: { type: DataTypes.STRING, allowNull: false },
    toName: { type: DataTypes.STRING, allowNull: false },
    distance: { type: DataTypes.FLOAT, allowNull: false },
    companyId: { type: DataTypes.STRING, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    flightStart: { type: DataTypes.DATE, allowNull: false },
    flightEnd: { type: DataTypes.DATE, allowNull: false },
    flightDuration: { type: DataTypes.FLOAT, allowNull: false }
});

module.exports = Travel;
