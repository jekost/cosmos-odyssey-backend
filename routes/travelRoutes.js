const express = require('express');
const axios = require('axios');
const PriceList = require('../models/PriceList');
const Reservation = require('../models/Reservation');
const Travel = require('../models/Travel');
const { Sequelize, Op } = require('sequelize');

const router = express.Router();

router.get('/travels', async (req, res, next) => {
    try {
      const travels = await Travel.findAll();
      res.json(travels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch valid travels' });
    }
});

// Get latest stored travel prices
router.get('/travels/valid', async (req, res) => {
    try {
        const validTravels = await Travel.findAll({
            where: {
                validUntil: { [Op.gt]: new Date() } // Only fetch PriceLists that are still valid
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(validTravels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch valid Travels' });
    }
});


router.get('/pricelists', async (req, res, next) => {
    try {
        const pricelists = await PriceList.findAll();
        res.json(pricelists);
    } catch (error) {
        next(error); // Passes errors to the error-handling middleware
    }
});

// Get valid stored travellists
router.get('/pricelists/valid', async (req, res) => {
    try {
        const validPriceLists = await PriceList.findAll({
            where: {
                validUntil: { [Op.gt]: new Date() } // Only fetch PriceLists that are still valid
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(validPriceLists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch valid PriceLists' });
    }
});

// Make a reservation
router.post('/reservations', async (req, res) => {
    try {
        const { firstName, lastName, routes, totalPrice, totalTime, companyNames } = req.body;
        const newReservation = await Reservation.create({
            firstName, lastName, routes, totalPrice, totalTime, companyNames
        });
        res.json(newReservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all reservations
router.get('/reservations', async (req, res) => {
    const reservations = await Reservation.findAll();
    res.json(reservations);
});

module.exports = router;
