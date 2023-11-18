
const mysql = require('mysql')

require('dotenv').config();


var config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
}

// console.log(process.env.TESTE + " vendo a env no db");

const conn = mysql.createConnection(config)

function testar() {
    console.log('testando funcao outro arquivo')
}




module.exports = { conn };