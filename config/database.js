const{Sequelize} = require("sequelize");
const sequelize = new Sequelize({
    dialect:'mysql',
    host:'localhost',
    username:'sidharth',
    password:'sidharth1311',
    database:'learningSequelize'

})
module.exports = sequelize;
