const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const orderItems = sequelize.define("orderItems", {
  orderItemID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "orders",
      key: "orderID",
    },
  },
  productID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "products",
      key: "productID",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pricePerUnit: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
  },
});
module.exports = orderItems;
