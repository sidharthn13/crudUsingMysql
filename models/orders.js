const customers = require("./customers")

module.exports = (Sequelize,DataType)=>{
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
                model:customers,
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