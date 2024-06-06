var Sequelize = require("sequelize");

var db = require("../library/db_sequelize");

const { DataTypes } = Sequelize;

const Users = db.define('user',{
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    user_photo: {
        type: DataTypes.STRING
    },
    access_id:{
        type: DataTypes.INTEGER
    },
    refresh_token: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName:true
});

module.exports = Users; 