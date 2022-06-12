const Sequelize = require('sequelize');
const db = require('../database/db');
const Assistance = require('../models/Assistance')
const bcrypt = require('bcrypt');

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false, 
        validate: {
            isEmail:{
                msg: 'agrega un correo valido'
            },
            notEmpty: {
                msg: 'El email no puede ser vacio'
            }
        },
        unique: {
            args: true,
            msg: 'User already registered'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ser vacio'
            }
        }
    },
    name: {
        type: Sequelize.STRING
    },
    active: {
        type: Sequelize.INTEGER,
        defaultValue: 0 
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE  
},{
    hooks: {
        beforeCreate(user){
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
        }
    }
});

Users.prototype.verificaPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

Users.hasMany(Assistance)

module.exports = Users;