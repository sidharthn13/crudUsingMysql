const express = require("express")
const mysql = require("mysql")

const connection = mysql.createConnection({
    host:'localhost',
    user:'sidharth',
    password:'sidharth1311',
    database:'crud'
});
connection.connect((err)=>{if(!err){console.log('connected')}});

const createQuery = `
INSERT INTO users (name, age) VALUES ( "devang", 23)`

connection.query(createQuery,(err,result)=>{
    if(err){console.log(`error:${err}`);}
    else{console.log('query injected into workspace')}
});
