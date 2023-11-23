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
const { Sequelize } = require("sequelize");
const sequelize = require("./config/database.js");
const customers = require("./models/customers.js");
const orders = require("./models/orders.js");
const products = require("./models/products.js");
const orderItems = require("./models/orderItems.js");
//using swagger dependencies
const swaggerJSDocs= require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions =  {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'CRUD API Documentation ',
      version: '1.0.0',
      description: 'performs CRUD operations on a sample dataset using mysql',
    },
    servers: [
      {
        url:`http://localhost:3000`,
      },
    ],
  },
  apis: ['./server.js'], // specify the path to API routes files
};
// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDocs(swaggerOptions);
// Serve Swagger UI at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json()); //middleware to parse JSON payload
connection.connect((err) => {
  if (!err) {
    console.log("connected to DB");
  }
});
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user account
 *     description: Creates a new user account with unique email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: John Doe
 *             age: 25
 *             email: john.doe@example.com
 *     responses:
 *       200:
 *         description: User account created successfully
 *       400:
 *         description: Bad request. An account with the provided email already exists.
 */
app.post("/users", validateInput, (req, res) => {
  const userDetails = {
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
  };
  const validationQuery = `SELECT name FROM crud.users WHERE email="${userDetails.email}"`;
  connection.query(validationQuery, (error, result) => {
    if (result.length > 0) {
      return res.status(400).end(
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
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user details based on the provided user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: John Doe
 *               age: 25
 *               email: john.doe@example.com
 *       500:
 *         description: Internal Server Error
 */
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
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: John Doe
 *                 age: 25
 *                 email: john.doe@example.com
 *               - id: 2
 *                 name: Jane Smith
 *                 age: 30
 *                 email: jane.smith@example.com
 *               # Add more user objects as needed
 *       500:
 *         description: Internal Server Error
 */
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
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Update user details based on the provided user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: User details to update
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Updated John Doe
 *             age: 30
 *             email: updated.john.doe@example.com
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       500:
 *         description: Internal Server Error
 */
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
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete user details based on the provided user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       500:
 *         description: Internal Server Error
 */
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  deleteUser(id);
  res.end(`deleted ${req.params.id}`);
});
//routes to handle CRUD operations on customers sample data(using ORM)
app.get("/customers/ledger", async (req, res) => {
  const joinQuery = `
  
SELECT CONCAT(c.firstName, ' ',c.lastName) AS FullName ,o.OrderDate AS dateOfOrder ,p.productName, p.price AS pricePerUnit,oi.quantity, oi.quantity * p.price AS totalAmount   
FROM customers c INNER JOIN orders o ON c.customerID = o.customerID
INNER JOIN orderItems oi ON o.orderID = oi.orderID INNER JOIN products p ON oi.productID = p.productID;
`;
  try {
    await sequelize.query(`USE learningSequelize;`);
    const result = await sequelize.query(joinQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(`Could not perform join operation:${error}`);
    res.status(500).json({ error: error });
  }
});
app.post("/customers", async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const [result, accountCreated] = await customers.findOrCreate({
      where: { email: data.email },
      defaults: {
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
      },
    });
    if (!accountCreated) {
      throw Error("customer is already registered in database");
    }
    res.status(200).end("Customer details added");
  } catch (error) {
    res.status(400).end(error.message);
  }
});
app.get("/customers", async (req, res) => {
  const result = await customers.findAll();
  res.status(200).json(result);
});
app.put("/customers/:id", async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const rowToUpdate = await customers.findByPk(id);
    if (rowToUpdate) {
      rowToUpdate.set({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        country: data.country,
      });
      await rowToUpdate.save();
      return res.status(200).end("Record updated");
    }
    res.status(400).end("No user with that ID");
  } catch (error) {
    res.status(500).json({ warning: error });
  }
});
app.delete("/customers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const rowToBeDeleted = await customers.findByPk(id);
    if (rowToBeDeleted) {
      await rowToBeDeleted.destroy();
      return res.status(200).end("User record deleted");
    }
    res.status(400).end("No user with that ID");
  } catch (error) {
    res.status(500).json({ warning: error });
  }
});
//sequelize ORM instance used inside call back function of server.listen
app.listen(3000, () => {
  console.log("server instance listening at port 3000");

  customers.sync().then((res) => {
    console.log("customer table created");
  });
  orders.sync().then((res) => {
    console.log("orders table created");
  });
  products.sync().then((res) => {
    console.log("products table created");
  });
  orderItems.sync().then((res) => {
    console.log("orderItems table created");
  });
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

//using bulk create to insert data(sample data)
async function generate_rows() {
  const customersData = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      country: "USA",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@email.com",
      country: "Canada",
    },
    {
      firstName: "andy",
      lastName: "gold",
      email: "andy.gold@email.com",
      country: "UK",
    },
  ];
  const ordersData = [
    { customerID: 1, OrderDate: "2023-01-15", TotalAmount: 150.0 },
    { customerID: 2, OrderDate: "2023-02-20", TotalAmount: 200.5 },
    { customerID: 3, OrderDate: "2023-03-10", TotalAmount: 75.25 },
  ];
  const productsData = [
    { productName: "laptop", price: 800.0 },
    { productName: "smartphone", price: 400.0 },
    { productName: "headphones", price: 50.0 },
  ];
  const orderItemsData = [
    { orderID: 1, productID: 1, quantity: 2, pricePerUnit: 800.0 },
    { orderID: 2, productID: 2, quantity: 1, pricePerUnit: 400.0 },
    { orderID: 3, productID: 3, quantity: 3, pricePerUnit: 50.0 },
  ];
  try {
    const customerTableResult = await customers.bulkCreate(customersData);
    const ordersTableResult = await orders.bulkCreate(ordersData);
    const productsTableResult = await products.bulkCreate(productsData);
    const orderItemsTableResult = await orderItems.bulkCreate(orderItemsData);
  } catch (error) {
    console.log(`warning, error: ${error}`);
  }
}
