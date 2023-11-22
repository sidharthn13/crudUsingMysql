const { DataTypes } = require('sequelize');
const sequelize = require("../config/database.js");
const products = sequelize.define('products',{
    productID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    productName:{
        type:DataTypes.STRING(20),
        allowNull:false
    },
    price:{
        type:DataTypes.DECIMAL(8,2),
        allowNull:false
    }
});
module.exports = products;
