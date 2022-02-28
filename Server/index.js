const reflect_metadata = require("reflect-metadata");
const { createConnection } = require("typeorm");

createConnection().then(async (connection) => {
  console.log("connection success");
}).catch(error => {
  console.log(error);
})

const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
const routes_path = require("./controller");
const cors = require('cors');
const config = require('./config');
const nodemailer = require("nodemailer");
const schedule = require('node-schedule');
    


app.set('jwt-secret', config.secret)

const RunType = "DEV"
//==
//크로스 브라우징 처리
const whitelist = ['http://localhost:8080', 'http://localhost:5000', 'undefined'];
const corsOptions = {
    origin: function(origin, callback){
      if(RunType === "DEV"){
        var isWhitelisted = true;
      }else{
        var isWhitelisted = whitelist.indexOf(origin) !== -1;
      }
      callback(null, isWhitelisted); 
    }, credentials:true
}
app.use( cors(corsOptions) );   
//==

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use(fileUpload());

app.use("/", routes_path);

// temp add
app.listen(5000,  () =>{
  console.log("Start Server");
});

console.log(app.route);

const j = schedule.scheduleJob('30 * * * * *', () => {
  console.log('Cron-style Scheduling')
})

module.exports = app;