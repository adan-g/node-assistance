const Sequelize = require('sequelize');
//const slug = require('slug');
const db = require('../database/db');
//const shortid = require('shortid');

const Assistance = db.define('assistance', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    /*id_user: {
        type: Sequelize.INTEGER
    },*/
    day: {
        type: Sequelize.STRING
    },
    entry: {
        type: Sequelize.TIME
    },
    exit: {
        type: Sequelize.TIME
    },
    date: {
        type: Sequelize.DATEONLY
    },
    week: {
        type: Sequelize.INTEGER
    },
    property: {
        type: Sequelize.STRING
    },
    lunch: {
        type: Sequelize.TIME
    },
    hoursDay: {
        type: Sequelize.TIME
    }
});


module.exports = Assistance;