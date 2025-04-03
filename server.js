require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const routes = require('./routes/routes');
const app = express();
require("./cron/cron");

app.use(express.json());
app.use(cors());

// sync db
sequelize.sync()
    .then(() => console.log("Database Connected in server.js"))
    .catch(err => console.error(err));

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
