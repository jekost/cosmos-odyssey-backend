const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
    totalDurationMillis: { type: DataTypes.FLOAT, allowNull: false },
    oldestPriceListId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },

    bookings: { 
        type: DataTypes.ARRAY(DataTypes.JSON), 
        allowNull: false,
        validate: {
            isArrayOfObjects(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Bookings must be an array.');
                }
                for (const booking of value) {
                    if (
                        typeof booking !== 'object' || 
                        !booking.offerId || 
                        !booking.company || 
                        !booking.planetFrom || 
                        !booking.planetTo ||
                        !booking.amount
                    ) {
                        throw new Error('Each booking must have offerId, companyName, fromName, and toName and amount');
                    }
                }
            }
        }
    }
});

module.exports = Reservation;
