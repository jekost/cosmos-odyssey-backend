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
const flattenObject = (obj, parentKey = '', res = {}) => {
  if (obj === null || obj === undefined) {
    res[parentKey] = obj;
    return res;
  }

  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const newKey = parentKey ? `${parentKey}_${key}` : key;
    const value = obj[key];

    if (Array.isArray(value)) {
      // keep arrays intact, but flatten each object inside
      res[newKey] = value.map((v, i) =>
        typeof v === 'object' && v !== null
          ? flattenObject(v, `${newKey}_${i}`, {})
          : v
      );
    } else if (value && typeof value === 'object') {
      // recurse into objects
      flattenObject(value, newKey, res);
    } else {
      // primitives + null
      res[newKey] = value;
    }
  }

  return res;
};

router.get('/travels/valid', async (req, res) => {
  try {
    const now = new Date();

    const validTravels = await Travel.findAll({
      include: [
        {
          model: Leg,
          as: 'leg',
          attributes: ['distance'],
          required: false,
          include: [
            {
              model: Planet,
              as: 'planetFrom',
              attributes: ['name'],
              required: false
            },
            {
              model: Planet,
              as: 'planetTo',
              attributes: ['name'],
              required: false
            }
          ]
        },
        {
          model: Company,
          as: 'company',
          attributes: ['name'],
          required: false,
        },
        {
          model: PriceList,
          as: 'priceList',
          where: { validUntil: { [Op.gt]: now } },
          required: true,
          attributes: ['validUntil']
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // flatten each object
    const flattened = validTravels.map(t => flattenObject(t.get({ plain: true })));

    //res.json(flattened);
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

router.get("/offersValid", async (req, res) => {
  try {
    const now = new Date();
    const travels = await Travel.findAll({
      include: [
        { model: PriceList, as: 'priceList',
          where: { validUntil: { [Op.gt]: now } },
          required: true,
          attributes: ['validUntil'] },
        { model: Leg, as: 'leg',  include: [
            { model: Planet, as: "planetFrom" },
            { model: Planet, as: "planetTo" }
          ] },
        { model: Company, as: 'company', }
      ]
    });

    const formatted = travels.map(travel => ({
      offerId: travel.offerId,
      priceListId: travel.priceListId,
      price: travel.price,
      flightStart: travel.flightStart,
      flightEnd: travel.flightEnd,
      flightDuration: travel.flightDuration,
      planetFrom: travel.leg.planetFrom.name,
      planetTo: travel.leg.planetTo.name,
      distance: travel.leg.distance,
      company: travel.company.name,
      validUntil: travel.priceList.validUntil
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).send({ error: err.message });
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

router.get("/legPlanets/:legId", async (req, res) => {
  try {
    const legId = req.params.legId;

    // Fetch ALL legs (assuming your /api/legs returns an array)
    const legsResponse = await fetch("http://localhost:5000/api/legs");
    if (!legsResponse.ok) return res.status(500).json({ error: "Failed to fetch legs" });
    const legs = await legsResponse.json();

    // Find the leg with the specific id
    const leg = legs.find(l => l.id === legId);
    if (!leg) return res.status(404).json({ error: "Leg not found" });

    // Fetch ALL planets
    const planetsResponse = await fetch("http://localhost:5000/api/planets");
    if (!planetsResponse.ok) return res.status(500).json({ error: "Failed to fetch planets" });
    const planets = await planetsResponse.json();

    // Find from and to planets
    const fromPlanet = planets.find(p => p.id === leg.fromId);
    const toPlanet = planets.find(p => p.id === leg.toId);

    res.json([fromPlanet?.name, toPlanet?.name]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
