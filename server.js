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
  const name = req.body.name;
  const age = req.body.age;
  const email = req.body.email;
  createUser(name, age, email);
  res.status(200).end("account created");
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
  const id = req.params.id;
  const name = req.body.name;
  const age = req.body.age;
  const email = req.body.email;
  updateUser(id, name, age, email);
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

function createUser(name, age, email) {
  const sqlQuery = `INSERT INTO users (name,age,email) VALUES ("${name}",${age},"${email}");`;
  connection.query(sqlQuery, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
}

function deleteUser(id) {
  const sqlQuery = `DELETE FROM users WHERE id = ${id};`;
  connection.query(sqlQuery, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
}

function updateUser(id, name, age, email) {
  const sqlQuery = `UPDATE users SET name = ?, age = ?, email = ? WHERE
    id = ? `;
  newData = [name, age, email, id];
  connection.query(sqlQuery, newData, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
}
