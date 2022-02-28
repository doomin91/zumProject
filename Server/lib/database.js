var mysql = require('mysql');



var db = mysql.createConnection({
  host:'192.168.253.111',
  port: '23306',
  user:'with',
  password:'dkrakrhs1004',
  database:'V_WITH_FLOW'
});

//mysql.connect();

db.connect();
module.exports = db;

