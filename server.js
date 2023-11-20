const express = require("express");
const app = express();
const mysql = require("mysql");
const { validateInput } = require("./middleware.js");
const connection = mysql.createConnection({
  host: "localhost",
  user: "sidharth",
  password: "sidharth1311",
  database: "crud",
});

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
app.listen(3000, () => {
  console.log("server instance listening at port 3000");
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
