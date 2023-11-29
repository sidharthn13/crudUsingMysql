const{DataTypes}= require("sequelize")
const sequelize = require("../config/database.js")
const userAccounts = sequelize.define("userAccounts", {
    customerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique:true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });
module.exports = userAccounts;