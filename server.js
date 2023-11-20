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


app.post("/users",validateInput,(req,res)=>{res.end('account created')})
app.get("/users/:id",(req,res)=>{res.end(`retrieved ${req.params.id}`)})
app.get("/users",(req,res)=>{res.end(`retrieved all data`)})
app.put("/users/:id",validateInput,(req,res)=>{res.end(`updated ${req.params.id}`)})
app.delete("/users/:id",(req,res)=>{res.end(`deleted ${req.params.id}`)})

app.listen(3000,()=>{console.log('server instance listening at port 3000')});