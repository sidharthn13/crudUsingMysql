const express = require("express");
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");
const { validateInput } = require("./middleware.js");
dotenv.config();
const connection = mysql.createConnection({
  host: process.env.DBhost,
  user: process.env.DBuser,
  password: process.env.DBpassword,
  database: process.env.DB,
});


//using sequelize
const sequelize = require("./config/database.js")

const customers = require("./models/customers.js");
const orders = require("./models/orders.js");
const products = require("./models/products.js");
const orderItems = require("./models/orderItems.js")



app.use(express.json()); //middleware to parse JSON payload
connection.connect((err) => {
  if (!err) {
    console.log("connected to DB");
  }
});
app.post("/users", validateInput, (req, res) => {
  const userDetails = {
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
  };
  const validationQuery = `SELECT name FROM crud.users WHERE email="${userDetails.email}"`;
  connection.query(validationQuery, (error, result) => {
    if (result.length > 0) {
      return res.end(
        "There is already an account registered with this Email-ID"
      );
    }
    const sqlQuery = `INSERT INTO users (name,age,email) VALUES ("${userDetails.name}",${userDetails.age},"${userDetails.email}");`;
    connection.query(sqlQuery, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      res.status(200).end("account created");
    });
  });
});
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const sqlQuery = `SELECT * FROM crud.users WHERE id = ${id}`;
  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
});
app.get("/users", (req, res) => {
  const sqlQuery = `SELECT * FROM crud.users`;
  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
});
app.put("/users/:id", validateInput, (req, res) => {
  const userDetails = {
    id: req.params.id,
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
  };
  updateUser(userDetails);
  res.end(`updated ${req.params.id}`);
});
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  deleteUser(id);
  res.end(`deleted ${req.params.id}`);
});


//sequelize ORM instance used inside call back function of server.listen

  app.listen(3000, () => {
    console.log("server instance listening at port 3000");
    
      customers.sync().then((res)=>{console.log("customer table created")});
      orders.sync().then((res)=>{console.log("orders table created")});
      products.sync().then((res)=>{console.log("products table created")});
      orderItems.sync().then((res)=>{console.log("orderItems table created")});
      //generate_rows()
  });


function deleteUser(id) {
  const sqlQuery = `DELETE FROM users WHERE id = ${id};`;
  connection.query(sqlQuery, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
}

function updateUser(userDetails) {
  const sqlQuery = `UPDATE users SET name = ?, age = ?, email = ? WHERE
    id = ? `;
  newData = [
    userDetails.name,
    userDetails.age,
    userDetails.email,
    userDetails.id,
  ];
  connection.query(sqlQuery, newData, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
}

//using bulk create to insert data
async function generate_rows(){
  const customersData = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com', country: 'USA' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@email.com', country: 'Canada' },
    { firstName: 'andy', lastName: 'gold', email: 'andy.gold@email.com', country: 'UK' },
  ];
  const ordersData = [
    {customerID:1, OrderDate:'2023-01-15',TotalAmount: 150.00},
    {customerID:2, OrderDate:'2023-02-20',TotalAmount: 200.50},
    {customerID:3, OrderDate:'2023-03-10',TotalAmount: 75.25},
  ];
  const productsData = [
    {productName:'laptop',price:800.00},
    {productName:'smartphone',price:400.00},
    {productName:'headphones',price:50.00},
  ];
  const orderItemsData = [
    {orderID:1,productID:1,quantity:2,pricePerUnit:800.00},
    {orderID:2,productID:2,quantity:1,pricePerUnit:400.00},
    {orderID:3,productID:3,quantity:3,pricePerUnit:50.00},
  ]
  try{
  const customerTableResult = await customers.bulkCreate(customersData);
  const ordersTableResult = await orders.bulkCreate(ordersData);
  const productsTableResult = await products.bulkCreate(productsData);
  const orderItemsTableResult = await orderItems.bulkCreate(orderItemsData);
  }
  catch(error){
    console.log(`warning, error: ${error}`)
  }
}