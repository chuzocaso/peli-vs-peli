var mysql = require ("mysql");

var configConnection = {
    host: "0.0.0.0",
    user: "root",
    password: "1234",
    database: "competencias",
    port: 3306
}

var connection = mysql.createConnection(configConnection);

module.exports = connection;
