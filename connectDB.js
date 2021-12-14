const mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "shootingDragon",
  password: "1793",
  database: "TMDB",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: \n " + err.message);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
