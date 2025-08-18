const express = require('express');
const { PriceList, Travel, Reservation, Company, Leg, Planet } = require('../models');
const TravelGenerator = require('../services/travelgenerator');
const { Sequelize, Op } = require('sequelize');


const router = express.Router();
const generator = new TravelGenerator();

router.get('/travels', async (req, res, next) => {
  try {
    const travels = await Travel.findAll({
      include: [
        {
          model: PriceList,
          as: 'priceList', // only if you defined an alias in the association
          required: false, // set to true if you want only travels that have a PriceList
        },
        {
          model: Leg,
          as: 'leg', // 👈 must match the alias defined in the association
        },
        {
          model: Company,
          as: 'company', // 👈 must match the alias defined above
        },
      ],
    });
    res.json(travels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch valid travels' });
  }
});

router.get('/legs', async (req, res, next) => {
    try {
      const legs = await Leg.findAll();
      res.json(legs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch valid legs' });
    }
});

router.get('/planets', async (req, res, next) => {
    try {
      const planets = await Planet.findAll();
      res.json(planets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch valid planets' });
    }
});

router.get('/companies', async (req, res, next) => {
    try {
      const companies = await Company.findAll();
      res.json(companies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch valid companies' });
    }
});

// get travel prices whose pricelists are currently valid
router.get('/travels/valid', async (req, res) => {
    try {
        const now = new Date();

        const validTravels = await Travel.findAll({
            include: [
                {
                    model: PriceList,
                    as: 'PriceList',
                    where: { validUntil: { [Op.gt]: now } },
                    attributes: []
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(validTravels);
    } catch (error) {
        console.error("Error fetching valid travels:", error);
        res.status(500).json({ error: 'Failed to fetch valid Travels' });
    }
});

router.get('/pricelists', async (req, res, next) => {
    try {
        const pricelists = await PriceList.findAll();
        res.json(pricelists);
    } catch (error) {
        next(error);
    }
});

router.get('/pricelists/valid', async (req, res) => {
    try {
        const validPriceLists = await PriceList.findAll({
            where: {
                validUntil: { [Op.gt]: new Date() }
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(validPriceLists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch valid PriceLists' });
    }
});

router.get('/pricelists/invalid', async (req, res) => {
    try {
        const validPriceLists = await PriceList.findAll({
            where: {
                validUntil: { [Op.lt]: new Date() }
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(validPriceLists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch invalid PriceLists' });
    }
});

//make a reservation
router.post('/reservations', async (req, res) => {
    try {
        const { firstName, lastName, totalPrice, totalDurationMillis, oldestPriceListId, bookings } = req.body;
        
        if (!bookings || !Array.isArray(bookings)) {
            return res.status(400).json({ error: 'Bookings must be a valid array.' });
        }
        
        const newReservation = await Reservation.create({
            firstName,
            lastName,
            totalPrice,
            totalDurationMillis,
            oldestPriceListId,
            bookings
        });
        
        res.json(newReservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/reservations', async (req, res) => {
    const reservations = await Reservation.findAll();
    res.json(reservations);
});

//get all valid reservations (so every single pricelist from that reservation's all bookings are currently valid)
router.get('/reservations/valid', async (req, res) => {
    try {
        const now = new Date(); // Ensure UTC consistency

        const validReservations = await Reservation.findAll({
            include: [
                {
                    model: PriceList,
                    as: 'PriceList',
                    where: { validUntil: { [Op.gt]: now } },
                    attributes: []
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(validReservations);
    } catch (error) {
        console.error("Error fetching valid travels:", error);
        res.status(500).json({ error: 'Failed to fetch valid Travels' });
    }
});


router.get('/generated', (req, res) => {
    res.json(generator.generateTravels());
});

module.exports = router;
