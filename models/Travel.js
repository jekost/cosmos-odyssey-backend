const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/database');

const Travel = sequelize.define('Travel', {
    priceListId: { type: DataTypes.UUID, allowNull: false},
    validUntil: { type: DataTypes.DATE, allowNull: false },
    legId: { type: DataTypes.UUID, allowNull: false},
    fromId: { type: DataTypes.UUID, allowNull: false},
    fromName: { type: DataTypes.STRING, allowNull: false },
    toId: { type: DataTypes.UUID, allowNull: false},
    toName: { type: DataTypes.STRING, allowNull: false },
    distance: { type: DataTypes.BIGINT, allowNull: false },
    offerId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false},
    companyName: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    flightStart: { type: DataTypes.DATE, allowNull: false },
    flightEnd: { type: DataTypes.DATE, allowNull: false },
});

module.exports = Travel;