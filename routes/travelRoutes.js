const express = require('express');
const axios = require('axios');
const PriceList = require('../models/PriceList');
const Reservation = require('../models/Reservation');
const Travel = require('../models/Travel');
const { Sequelize } = require('sequelize');

const router = express.Router();

router.get('/travels', async (req, res, next) => {
    try {
      const travels = await Travel.findAll();
      res.json(travels);
    } catch (error) {
      next(error); // Passes errors to the error-handling middleware
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

// Fetch & store travel prices from external API
router.get('/prices', async (req, res) => {
    try {
        const response = await axios.get(process.env.API_URL);
        const data = response.data;

        const oldCount = await PriceList.count();

        data.legs.flatMap(leg => 
            leg.providers.map(async provider => {
                await Travel.upsert({
                    priceListId: data.id,
                    validUntil: data.validUntil,
                    legId: leg.id,
                    fromId: leg.routeInfo.from.id,
                    fromName: leg.routeInfo.from.name,
                    toId: leg.routeInfo.to.id,
                    toName: leg.routeInfo.to.name,
                    distance: leg.routeInfo.distance,
                    offerId: provider.id,
                    companyId: provider.company.id,
                    companyName: provider.company.name,
                    price: provider.price,
                    flightStart: provider.flightStart,
                    flightEnd: provider.flightEnd,
                });
            })
        );

        await PriceList.upsert({
            validUntil: data.validUntil,
            id: data.id
        });
    

        const newCount = await PriceList.count();
        const oldest = await PriceList.findOne({ order: [['createdAt', 'ASC']] });

        const oldestTravels = await Travel.findAll({
            where: {
                priceListId: oldest.dataValues.id,
                },
        });

        console.log("oldest is valid until:", oldest.dataValues.validUntil);

        /*
        oldestTravels.forEach(element => {
            console.log(element.dataValues.companyId)
        });
        const count = await PriceList.count();
        if (count >= 15) {
            const oldest = await PriceList.findOne({ order: [['createdAt', 'ASC']] });
            if (oldest) await oldest.destroy();
        }
        */

        //TODO: destroy if more than 15 PriceLists in db


        if (oldCount != newCount) {
            console.log(oldCount);
            console.log(newCount);

            const oldest = await PriceList.findOne({ order: [['createdAt', 'ASC']] });

            console.log("not equal, db updated");
            //console.log(oldest);
            
            //if (oldest) await oldest.destroy();
        }
        console.log(new Date().toISOString(), "||| CRONJOB: checked");

        res.json
    } catch (error) {

        console.error("❌ API Fetch Error:", error);
        }
        
});


// Get latest stored travel prices
router.get('/prices/latest', async (req, res) => {
    const latest = await PriceList.findOne({ order: [['createdAt', 'DESC']] });
    res.json(latest);
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
