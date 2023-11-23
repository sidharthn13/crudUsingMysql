const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const customers = require("./customers.js");
const orders = sequelize.define("orders", {
  orderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: customers,
      key: "customerID",
    },
  },
  OrderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});
module.exports = orders;
