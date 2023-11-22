const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

    const customers = sequelize.define("customers",{
        customerID:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        firstName:{
            type:DataTypes.STRING(50),
            allowNull:false,
        },
        lastName:{
            type:DataTypes.STRING(50),
            allowNull:false
        },
        email:{
            type:DataTypes.STRING(100),
            allowNull:false,
            unique:true
        },
        country:{
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    })
module.exports = customers;