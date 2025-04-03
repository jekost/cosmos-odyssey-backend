const cron = require("node-cron");
const axios = require("axios");
const { PriceList, Travel, Reservation } = require('../models');

//takes the prices the api and puts them in the db schemas
async function fetchPrices(){
    const cleanInvalidPriceLists = async () => {
        try {

            const response = await axios.get(`${process.env.URL}/api/pricelists/invalid`);
            let invalidPriceLists = response.data;

            if (invalidPriceLists.length > 15) {

                
                // Sort invalid price lists by createdAt ascending (oldest first)
                invalidPriceLists.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                
                // Calculate how many need to be removed to keep only 15
                const excessCount = invalidPriceLists.length - 15;
                const priceListsToDelete = invalidPriceLists.slice(0, excessCount);
                
                for (const priceList of priceListsToDelete) {
                    await Travel.destroy({ where: { priceListId: priceList.id } });
                    await PriceList.destroy({ where: { id: priceList.id } });
                    await Reservation.destroy({ where: { oldestPriceListId: priceList.id } });
                    console.log("Invalid price list deleted: ", priceList.id);
                }
            }
        } catch (error) {
            console.error("Error cleaning invalid price lists:", error);
        }
    };
    const upsertApiCall = async (data) => {
        await PriceList.upsert({
            id: data.id,
            validUntil: data.validUntil
        });

        for (const leg of data.legs) {
            for (const provider of leg.providers) {
                await Travel.upsert({
                    priceListId: data.id,
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
                    flightDuration: (new Date(provider.flightEnd) - new Date(provider.flightStart))
                });
            }
        }


    }

    try {
        const response = await axios.get(process.env.API_URL);
        const data = response.data;


        upsertApiCall(data);
        cleanInvalidPriceLists();

        const oldest = await PriceList.findOne({ order: [['createdAt', 'ASC']] });
        const youngest = await PriceList.findOne({ order: [['createdAt', 'DESC']] });
        console.log("oldest is valid until:", oldest.dataValues.validUntil);
        console.log("youngest is valid until:", youngest.dataValues.validUntil);

        console.log(new Date().toISOString(), "||| CRONJOB: checked");

    } catch (error) {
        console.error("API Fetch Error:", error);
        }
};

// Schedule the task to run every 1 minute
cron.schedule("* * * * *", async () => {
  try {
    await fetchPrices();
  } catch (error) {
    console.error("Error in fetchPrices:", error);
  }
}, {
  scheduled: true,
  timezone: "UTC" // Adjust based on your needs
});

console.log("Cron job scheduled: Fetching data every minute");
