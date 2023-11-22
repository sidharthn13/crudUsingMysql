const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance and connect to DB
const sequelize = new Sequelize('learningSequelize', 'sidharth', 'sidharth1311', {
  host: 'localhost',
  dialect: 'mysql', 
});


module.exports = (sequelize, DataTypes)=>{
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
    return customers;
}