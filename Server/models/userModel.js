// "use strict";
const db = require("../lib/database");

const UserEntity = require("../entities/User");
const { getRepository, Like } = require("typeorm");

/**
 * 전체 유저 불러오기
 * @param {*} req 
 * @param {*} res 
 */
 exports.getUserList = async function(req, res){
  if(req.body.searchField == null){
      req.body.searchField = "all";
  }

  const SearchField = {
      id :    {  
                  context: "USER.USER_ID Like :id",
                  condition: { id : `%${req.body.searchString}%` }
              },
      name :  { 
                  context: "USER.USER_NAME Like :name",
                  condition: { name : `%${req.body.searchString}%` }
              },
      company_id : { 
                  context: "USER.USER_COMPANY_ID Like :company_id",
                  condition: { company_id : `%${req.body.searchString}%` }
              },
      email : { 
                  context: "USER.USER_EMAIL Like :email",
                  condition: { email : `%${req.body.searchString}%` }
              },
      all :   {
                  context: "( USER.USER_ID Like :id or USER.USER_NAME Like :name or USER.USER_COMPANY_ID Like :company_id or USER.USER_EMAIL Like :email )",
                  condition: { id : `%${req.body.searchString}%`,
                              name : `%${req.body.searchString}%`,
                              company_id : `%${req.body.searchString}%`,
                              email : `%${req.body.searchString}%` }
              }};

  const MatchCondition = SearchField[req.body.searchField];
  const UserRepository = getRepository(UserEntity);
  let Query = UserRepository.createQueryBuilder("USER")
          .where("USER.USER_DEL_YN = :delete", { delete : 'N'})
          Query.andWhere("USER.USER_AUTH = :auth", { auth : 'N'})
          Query.andWhere(MatchCondition.context, MatchCondition.condition)
      if(req.body.startDate != null){
          Query.andWhere("USER.USER_REG_DATE >= :startDate", { startDate : req.body.startDate })
      }
      if(req.body.EndDate != null){
          Query.andWhere("USER.USER_REG_DATE <= :endDate", { endDate : req.body.endDate })
      }
      if(req.body.department != null){
          Query.andWhere("USER.USER_DEPARTMENT = :depart", { depart : req.body.department})
      }
      if(req.body.position != null){
          Query.andWhere("USER.USER_POSITION = :position", { position : req.body.position })
      }
      Query.leftJoinAndSelect("USER.DEPART_INFO", "DEPART")
      Query.leftJoinAndSelect("USER.POSITION_INFO", "POSITION")
      Query.orderBy("USER.USER_REG_DATE", "DESC");


  const AllUsers = await Query.getMany();

  res.json(AllUsers);
}

exports.getAdminList = async function(req, res){
  if(req.body.searchField == null){
      req.body.searchField = "all";
  }

  const SearchField = {
      id :    {  
                  context: "USER.USER_ID Like :id",
                  condition: { id : `%${req.body.searchString}%` }
              },
      name :  { 
                  context: "USER.USER_NAME Like :name",
                  condition: { name : `%${req.body.searchString}%` }
              },
      company_id : { 
                  context: "USER.USER_COMPANY_ID Like :company_id",
                  condition: { company_id : `%${req.body.searchString}%` }
              },
      email : { 
                  context: "USER.USER_EMAIL Like :email",
                  condition: { email : `%${req.body.searchString}%` }
              },
      all :   {
                  context: "( USER.USER_ID Like :id or USER.USER_NAME Like :name or USER.USER_COMPANY_ID Like :company_id or USER.USER_EMAIL Like :email )",
                  condition: { id : `%${req.body.searchString}%`,
                              name : `%${req.body.searchString}%`,
                              company_id : `%${req.body.searchString}%`,
                              email : `%${req.body.searchString}%` }
              }};

  const MatchCondition = SearchField[req.body.searchField];
  const UserRepository = getRepository(UserEntity);
  let Query = UserRepository.createQueryBuilder("USER")
          .where("USER.USER_DEL_YN = :delete", { delete : 'N'})
          Query.andWhere("USER.USER_AUTH = :auth", { auth : 'Y'})
          Query.andWhere(MatchCondition.context, MatchCondition.condition)
      if(req.body.startDate != null){
          Query.andWhere("USER.USER_REG_DATE >= :startDate", { startDate : req.body.startDate })
      }
      if(req.body.EndDate != null){
          Query.andWhere("USER.USER_REG_DATE <= :endDate", { endDate : req.body.endDate })
      }
      if(req.body.department != null){
          Query.andWhere("USER.USER_DEPARTMENT = :depart", { depart : req.body.department})
      }
      if(req.body.position != null){
          Query.andWhere("USER.USER_POSITION = :position", { position : req.body.position })
      }
      Query.leftJoinAndSelect("USER.DEPART_INFO", "DEPART")
      Query.leftJoinAndSelect("USER.POSITION_INFO", "POSITION")


  const AllUsers = await Query.getMany();

  res.json(AllUsers);
}





exports.findAll = function(request, response) {
  let sql = `SELECT * FROM TBL_FW_USER
                 LEFT JOIN TBL_FW_DEPARTMENT ON USER_DEPARTMENT = DEPARTMENT_SEQ
                 LEFT JOIN TBL_FW_CODE ON USER_POSITION = CODE_SEQ
                 WHERE USER_DEL_YN = 'N' `

                 if(request.body.start_date != null){
                    sql += ` AND USER_REG_DATE >= ` + request.body.start_date;
                 }
                 if(request.body.end_date != null){
                    sql += ` AND USER_REG_DATE <= ` + request.body.end_date;
                 }
                 if(request.body.department != null){
                    sql += ` AND DEPARTMENT_SEQ = ` + request.body.department;
                 }
                 if(request.body.position != null){
                    sql += ` AND CODE_SEQ = ` + request.body.position;
                 }
                 if(request.body.search_field != null){
                    switch(request.body.search_field){
                      case "id":
                        sql += ` AND USER_ID LIKE '%` + request.body.search_string + `%';`;
                        break;
                      case "name":
                        sql += ` AND USER_NAME LIKE '%` + request.body.search_string + `%';`;
                        break;
                      case "compnay_id":
                        sql += ` AND USER_COMPANY_ID LIKE '%` + request.body.search_string + `%';`;
                        break;
                      case "email":
                        sql += ` AND USER_EMAIL LIKE '%` + request.body.search_string + `%';`;
                        break;
                    }
                 }

                sql += ` ORDER BY USER_SEQ DESC`;
                
  db.query(sql, function(error , resultData){
    if(error){
      throw error;
    }else{
      const ReturnData=JSON.parse(JSON.stringify(resultData));
      response.json(ReturnData);      
    }
  });
}; 

exports.findOne = function(USER_SEQ, response){
  let sql = `SELECT * FROM TBL_FW_USER
             LEFT JOIN TBL_FW_DEPARTMENT ON USER_DEPARTMENT = DEPARTMENT_SEQ
             LEFT JOIN TBL_FW_CODE ON USER_POSITION = CODE_SEQ
             WHERE USER_SEQ = ?`;
  let param = [USER_SEQ];
  db.query(sql, param,  function(error, resultData){
    if(error){
      throw error
    }else {
      const ReturnData=JSON.parse(JSON.stringify(resultData));
      response.json(ReturnData);
    }
  })
}

exports.updateUserInfo = function(request, response){
  let sql = `UPDATE TBL_FW_USER SET 
              USER_PASS = ?, 
              USER_NAME = ?,
              USER_PHONE = ?,
              USER_EMAIL = ?,
              USER_DEPARTMENT = ?,
              USER_POSITION = ?,
              USER_COMPANY_ID = ?,
              USER_STATUS = ?,
              USER_RULE_AUTH = ?
              WHERE USER_SEQ = ?`;

  let params = [
      request.USER_PASS,
      request.USER_NAME,
      request.USER_PHONE,
      request.USER_EMAIL,
      request.USER_DEPARTMENT,
      request.USER_POSITION,
      request.USER_COMPANY_ID,
      request.USER_STATUS,
      request.USER_RULE_AUTH,
      request.USER_SEQ
  ];

  db.query(sql, params, function(error, resultData){
    if(error){
      throw error;
    }else {
      response.json(resultData);
    }
  })
}

exports.createUserInfo = function(request, response){
  let sql = `INSERT INTO TBL_FW_USER (USER_ID, USER_PASS, USER_NAME, USER_PHONE, USER_EMAIL, USER_DEPARTMENT, USER_POSITION, USER_COMPANY_ID, USER_STATUS, USER_RULE_AUTH, USER_AUTH, USER_DEL_YN, USER_RETIRE_YN
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    
  let params = [
        request.USER_ID,
        request.USER_PASS,
        request.USER_NAME,
        request.USER_PHONE,
        request.USER_EMAIL,
        request.USER_DEPARTMENT,
        request.USER_POSITION,
        request.USER_COMPANY_ID,
        request.USER_STATUS,
        request.USER_RULE_AUTH,
        'N',
        'N',
        'N'
  ];

  db.query(sql, params, function(error, resultData){
    if(error){
      throw error;
    }else {
      response.json(resultData);
    }
  })
}

exports.deleteUser = function(request, response){
  let sql = `UPDATE TBL_FW_USER SET USER_DEL_YN ='Y' WHERE USER_SEQ = ` + request.USER_SEQ;
  db.query(sql, function(error , resultData){
    if(error){
      throw error
    }else{
      const ReturnData=JSON.parse(JSON.stringify(resultData));
      response.json(ReturnData);
    }
  });
}

exports.searchAll = function(request, response){
  let sql = `SELECT * FROM TBL_FW_USER
                 LEFT JOIN TBL_FW_DEPARTMENT ON USER_DEPARTMENT = DEPARTMENT_SEQ
                 LEFT JOIN TBL_FW_CODE ON USER_POSITION = CODE_SEQ
                 WHERE USER_DEL_YN = 'N' `

                 if(request.body.start_date != null){
                    sql += ` AND USER_REG_DATE >= ` + request.body.start_date;
                 }
                 if(request.body.end_date != null){
                    sql += ` AND USER_REG_DATE <= ` + request.body.end_date;
                 }
                 if(request.body.department != null){
                    sql += ` AND DEPARTMENT_SEQ = ` + request.body.department;
                 }
                 if(request.body.position != null){
                    sql += ` AND CODE_SEQ = ` + request.body.position;
                 }
                 if(request.body.search_field != null){
                    switch(request.body.search_field){
                      case "id":
                        sql += ` AND USER_ID LIKE '%` + request.body.search_string + `%';`;
                        break;
                      case "name":
                        sql += ` AND USER_NAME LIKE '%` + request.body.search_string + `%';`;
                        break;
                      case "compnay_id":
                        sql += ` AND USER_COMPANY_ID LIKE '%` + request.body.search_string + `%';`;
                        break;
                      case "email":
                        sql += ` AND USER_EMAIL LIKE '%` + request.body.search_string + `%';`;
                        break;
                    }
                 } else {
                   sql += ` AND
                    ( USER_ID LIKE '%` + request.body.search_string + `%' OR
                    USER_NAME LIKE '%` + request.body.search_string + `%' OR
                    USER_COMPANY_ID LIKE '%` + request.body.search_string + `%' OR
                    USER_EMAIL LIKE '%` + request.body.search_string + `%' )`;
                 }

                 sql += ` ORDER BY USER_SEQ DESC`;
                 

  db.query(sql, function(error , resultData){
    if(error){
      throw error
    }else{
      const ReturnData=JSON.parse(JSON.stringify(resultData));
      response.json(ReturnData);
    }
  });
}; 

exports.modifyAuth = function(request, response){
  let sql = `UPDATE TBL_FW_USER SET USER_AUTH = '` + request.USER_AUTH + `' WHERE USER_SEQ = ` + request.USER_SEQ;

  db.query(sql, function(error, resultData){
    if(error){
      throw error
    }else {
      const ReturnData=JSON.parse(JSON.stringify(resultData));
      response.json(ReturnData);
    }
  })
}

exports.searchAdmin = async function (req, res){
  const searchString = req.body.searchString;
  const UserRepository = getRepository(UserEntity);
  let Query = UserRepository.createQueryBuilder("USER")
              .where("USER.USER_NAME Like :name", { name : `%${searchString}%`})
              .andWhere("USER.USER_AUTH = 'N'")
              .leftJoinAndSelect("USER.DEPART_INFO", "DEPART")
              .leftJoinAndSelect("USER.POSITION_INFO", "POSITION")

  let result = await Query.getMany();
  res.json(result);
}

exports.searchUser = async function (req, res){
  const searchString = req.body.searchString;
  const UserRepository = getRepository(UserEntity);
  let Query = UserRepository.createQueryBuilder("USER")
              .where("USER.USER_NAME Like :name", { name : `%${searchString}%`})
              .leftJoinAndSelect("USER.DEPART_INFO", "DEPART")
              .leftJoinAndSelect("USER.POSITION_INFO", "POSITION")

  let result = await Query.getMany();
  return result;
}