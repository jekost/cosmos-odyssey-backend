require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const travelRoutes = require('./routes/travelRoutes');
const app = express();
require("./cron/cron"); // This automatically starts the cron job

app.use(express.json());
app.use(cors());

// Sync Database
sequelize.sync()
    .then(() => console.log("Database Connected in server.js"))
    .catch(err => console.error(err));


// API Routes
app.use('/api', travelRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
