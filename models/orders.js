



const customers = require("./customers")
module.exports = (sequelize, DataTypes)=>{
    const orders = sequelize.define("orders",{
        orderID:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        customerID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'customers.js',
                key:'customerID'
            }
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
    return orders;
}