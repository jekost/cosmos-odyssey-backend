const express = require("express");
const app = express();
const mysql = require("mysql");
const db = require("./models");




db.sequelize.sync().then((req) => {
    app.listen(3001, () => {
        console.log("db running")
    });
});