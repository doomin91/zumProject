"use strict";
const db = require("../lib/database");

exports.findAll = function(request, response){
  db.query(`SELECT * FROM TBL_FW_CODE`, function(error , resultData){
    if(error){
      throw error
    }else{
      const ReturnData=JSON.parse(JSON.stringify(resultData));
      response.json(ReturnData);
    }
  });
}; 
