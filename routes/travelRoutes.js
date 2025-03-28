const express = require('express');
const axios = require('axios');
const PriceList = require('../models/PriceList');
const Reservation = require('../models/Reservation');
const Travel = require('../models/Travel');
const { Sequelize } = require('sequelize');

const router = express.Router();



// Fetch & store travel prices from external API
router.get('/prices', async (req, res) => {
    try {
        const response = await axios.get(process.env.API_URL);
        const data = response.data;

        // 🔍 Log the full API response for debugging
        //console.log("🔍 API Response:", JSON.stringify(data, null, 2));

        if (!data || !data.validUntil || !data.legs) {
            return res.status(400).json({ error: "Invalid API response" });
        }

        // 🔹 Transform API data to match database schema
        const formattedRoutes = data.legs.flatMap(leg => 
            leg.providers.map(provider => (
                {
                priceListId: data.id,
                validUntil: data.validUntil,
                legId: leg.id,
                fromId: leg.routeInfo.from.id,
                fromName: leg.routeInfo.from.name,
                toId: leg.routeInfo.to.id,
                toName: leg.routeInfo.to.name,
                distance: leg.routeInfo.distance,
                provideId: provider.id,
                companyId: provider.company.id,
                companyName: provider.company.name,
                price: provider.price,
                flightStart: provider.flightStart,
                flightEnd: provider.flightEnd,
                }
            ))
        );

        // 🔹 Log transformed data for debugging
        //console.log("🛣 Transformed Routes Data:", JSON.stringify(formattedRoutes, null, 2));

        // 🔹 Store only the last 15 price lists
        const count = await PriceList.count();
        if (count >= 15) {
            const oldest = await PriceList.findOne({ order: [['createdAt', 'ASC']] });
            if (oldest) await oldest.destroy();
        }

        formattedRoutes.forEach(route => {
            Travel.upsert({
                priceListId: route.priceListId,
                validUntil: route.validUntil,
                legId: route.legId,
                fromId: route.fromId,
                fromName: route.fromName,
                toId: route.toId,
                toName: route.toName,
                distance: route.distance,
                provideId: route.provideId,
                companyId: route.companyId,
                companyName: route.companyName,
                price: route.price,
                flightStart: route.flightStart,
                flightEnd: route.flightEnd,
            });
        });

        PriceList.upsert({
            validUntil: data.validUntil,
            id: data.id
        });

        console.log("data inserted, valid until:", data.validUntil);


        res.json({data: formattedRoutes });
    } catch (error) {
        console.error("❌ API Fetch Error:", error);
        res.status(500).json({ error: error.message });
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
