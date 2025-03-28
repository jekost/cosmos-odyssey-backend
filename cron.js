const cron = require("node-cron");
const axios = require("axios");
const PriceList = require('./models/PriceList');
const Reservation = require('./models/Reservation');
const Travel = require('./models/Travel');
//const  fetchPrices = require("./routes/travelRoutes");
const express = require('express');
const { Sequelize } = require('sequelize');
const router = express.Router();
const sequelize = require('./config/database');


sequelize.sync()
    .then(() => console.log("Database Connected in server.js"))
    .catch(err => console.error(err));

async function fetchPrices(){
    //exports.fetchPrices = async function () {
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

            console.log("oldest is valid until:");
            console.log(oldest.dataValues.validUntil);

            /*
            oldestTravels.forEach(element => {
                console.log(element.dataValues.companyId)
            });
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

        } catch (error) {
            console.error("❌ API Fetch Error:", error);
        }
    };

// Schedule the task to run every 10 minutes
cron.schedule("*/10 * * * * *", async () => {
  try {
    await fetchPrices();
  } catch (error) {
    console.error("❌ Error in fetchPrices:", error);
  }
}, {
  scheduled: true,
  timezone: "UTC" // Adjust based on your needs
});

console.log("🚀 Cron job scheduled: Fetching data every 10 seconds");
