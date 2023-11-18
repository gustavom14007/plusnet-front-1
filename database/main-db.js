// db/main-db.js
const mysql = require('mysql');
require('dotenv').config();

const config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
};

const conn = mysql.createConnection(config);

function testar() {
    console.log('Testando a função em outro arquivo');
}

module.exports = {
    conn,
    testar,
};
