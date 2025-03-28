const cron = require("node-cron");
const axios = require("axios");
const PriceList = require('./models/PriceList');
const Travel = require('./models/Travel');


//võtab apist hinnad ja paneb minu db-sse
async function fetchPrices(){
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
        if (newCount> 18){
            const oldest = await PriceList.findOne({ order: [['createdAt', 'ASC']] });
            await Travel.destroy({
                where: {
                    priceListId: oldest.dataValues.id,
                    },
            });
            await PriceList.destroy({
                where: {
                    id: oldest.dataValues.id,
                    },
            });
            console.log("old lines destoryed with date: ", oldest.dataValues.validUntil)

        }

        const oldest = await PriceList.findOne({ order: [['createdAt', 'ASC']] });
        const youngest = await PriceList.findOne({ order: [['createdAt', 'DESC']] });
        console.log("oldest is valid until:", oldest.dataValues.validUntil);
        console.log("youngest is valid until:", youngest.dataValues.validUntil);

        console.log(new Date().toISOString(), "||| CRONJOB: checked");

    } catch (error) {
        console.error("❌ API Fetch Error:", error);
        }
};

// Schedule the task to run every 10 minutes
cron.schedule("* * * * *", async () => {
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
