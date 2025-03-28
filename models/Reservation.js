const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    routes: { type: DataTypes.JSON, allowNull: false },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
    totalTime: { type: DataTypes.FLOAT, allowNull: false },
    companyNames: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false }
});

module.exports = Reservation;
