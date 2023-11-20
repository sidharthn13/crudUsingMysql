const express = require("express")
const app = express();
const mysql = require("mysql")
const {validateInput} = require("./middleware.js")

//middleware to parse JSON payload
app.use(express.json());

const connection = mysql.createConnection({
    host:'localhost',
    user:'sidharth',
    password:'sidharth1311',
    database:'crud'
});
connection.connect((err)=>{if(!err){console.log('connected to DB')}});

const createQuery = `
INSERT INTO users (name, age) VALUES ( "devang", 23)`

/*
connection.query(createQuery,(err,result)=>{
    if(err){console.log(`error:${err}`);}
    else{console.log('query injected into workspace')}
});
*/


app.post("/users",validateInput,(req,res)=>{
    const name = req.body.name;
    const age = req.body.age;
    const email = req.body.email
    createUser(name,age,email);
    res.status(200).end('account created');})

app.get("/users/:id",(req,res)=>{res.end(`retrieved ${req.params.id}`)})

app.get("/users",(req,res)=>{res.end(`retrieved all data`)})

app.put("/users/:id",validateInput,(req,res)=>{res.end(`updated ${req.params.id}`)})

app.delete("/users/:id",(req,res)=>{
    const id = req.params.id;
    deleteUser(id);
    res.end(`deleted ${req.params.id}`);})

app.listen(3000,()=>{console.log('server instance listening at port 3000')});


function createUser(name,age,email){
    const sqlQuery = `INSERT INTO users (name,age,email) VALUES ("${name}",${age},"${email}")`
    connection.query(sqlQuery,(error,result)=>{
        if(error){console.log(error);}
    })
}

function deleteUser(id){
    const sqlQuery = `DELETE FROM users WHERE id = ${id}`
    connection.query(sqlQuery,(error,result)=>{
        if(error){console.log(error)}
    })
}