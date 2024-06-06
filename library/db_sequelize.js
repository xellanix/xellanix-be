var Sequelize = require("sequelize");

const db = new Sequelize('xellanix_development', 'root', '',{
    host: "localhost",
    dialect: "mysql"
});

module.exports = db;