// npm i mysql dotenv -- save
require('dotenv').config(); //process
const { createConnection } = require('mysql');
const connection = createConnection({
    host: process.env.host,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    port: process.env.dbPort,
    database: process.env.database,
    multipleStatements: true
});
// const mysql = require('mysql');
// const connection = mysql.Connection({
//     host: process.env.host,
//     user: process.env.dbUser,
//     password: process.env.dbPassword,
//     port: process.env.dbPort,
//     database: process.env.database,
//     multipleStatements: true
// });

connection.connect( (err)=> {
    if(err) throw err 
})

module.exports = connection;