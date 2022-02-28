// "use strict";
const db = require("../lib/database");

const TakeOverEntity = require("../entities/TakeOver");
const DepartEntity = require("../entities/Depart");
const UserEntity = require("../entities/User");
const PositionEntity = require("../entities/Position");

const { getRepository, Like } = require("typeorm");

/**
 * 전체 유저 불러오기
 * @param {*} req 
 * @param {*} res 
 */

exports.insertChildren = async function (req, res){
    const DepartRepository = getRepository(DepartEntity);
    let Query = DepartRepository.createQueryBuilder("DEPART")
                .insert()
                .values([
                    {
                    DEPARTMENT : req.body.departName,
                    DEPARTMENT_CODE : req.body.departCode,
                    DEPARTMENT_TEL : req.body.departTel,
                    PARENT_DEPARTMENT_SEQ : req.body.departParent,
                    DEPARTMENT_DEL_YN : 'N',
                    DEPTH : req.body.departDepth,
                    REF : req.body.departRef
                    }
                ])

    const result = await Query.execute();
    
    res.json(result);
}

exports.updateDepart = async function (req, res){
    const DepartRepository = getRepository(DepartEntity);
    let Query = DepartRepository.createQueryBuilder("DEPART")
                .update()
                .set({
                    DEPARTMENT : req.body.departName,
                    DEPARTMENT_CODE : req.body.departCode,
                    DEPARTMENT_TEL : req.body.departTel
                })
                .where("DEPARTMENT_SEQ = :seq", { seq : req.body.departSeq })
                
    const result = await Query.execute();

    res.json(result);
}

exports.deleteDepart = async function (req, res){
    const DepartRepository = getRepository(DepartEntity);
    let Query = DepartRepository.createQueryBuilder("DEPART")
                .update()
                .set({ DEPARTMENT_DEL_YN: "Y"})
                .where("DEPARTMENT_SEQ = :seq", { seq : req.body.departSeq })
                .orWhere("PARENT_DEPARTMENT_SEQ = :parent_seq", { parent_seq : req.body.departSeq} )
                
    const result = await Query.execute();

    res.json(result);
}

exports.getDepartChart = async function(req, res){
    const DepartRepository = getRepository(DepartEntity);
    const Query = await DepartRepository.createQueryBuilder("DEPART")
                  .where("DEPARTMENT_DEL_YN = 'N'")
                  .orderBy("DEPART.REF", "ASC")
                  .addOrderBy("DEPART.PID", "ASC")
                  .addOrderBy("DEPART.DEPARTMENT_SEQ", "ASC")
                  .getMany();
  
    res.json(Query);
}

exports.getDepartList = async function(req, res){
    const searchString = req.body.searchString;
    const DepartRepository = getRepository(DepartEntity);
    const Query = await DepartRepository.createQueryBuilder("DEPART")
                  .where("DEPART.DEPARTMENT Like :searchString", { searchString : `%${searchString}%`})
                  .andWhere("DEPARTMENT_DEL_YN = 'N'")
                  .getMany();
  
    return Query;
}

/** ADMIN ADD MODAL */
exports.addAdminUser = async function(data, res){
    const UserRepository = getRepository(UserEntity)
    let Qurey = UserRepository.createQueryBuilder("USER")
            .update()
            .set({USER_AUTH: 'Y'})
            .where("USER_SEQ = :seq", { seq : data.userSeq })

    const result = await Qurey.execute();
    res.json(result);
}

exports.getUsersInDepart = async function(req, res){
    const UserRepository = getRepository(UserEntity)
    let Qurey = UserRepository.createQueryBuilder("USER")
            .where("USER_DEPARTMENT = :depart", { depart : req.body.departSeq } )
            .andWhere("USER_AUTH = 'N'")
            .leftJoinAndSelect("USER.DEPART_INFO", "DEPART")
            .leftJoinAndSelect("USER.POSITION_INFO", "POSITION")

    const result = await Qurey.getMany();

    res.json(result);
}

exports.getPositionList = async function(req, res){
    const PositionRepository = getRepository(PositionEntity);
    const qurey = PositionRepository.createQueryBuilder("POSITION")
    const result = await qurey.getMany();
    return result;
}
// exports.getTakeOver = async function(req, res){
//     const TakeOverRepository = getRepository(TakeOverEntity);
//     let Qurey = TakeOverRepository.createQueryBuilder("TAKE_OVER")
//                     .where("DEL_YN = 'N'")
//                     .leftJoinAndSelect("TAKE_OVER.FROM", "FROM")
//                     .leftJoinAndSelect("TAKE_OVER.TO", "TO")

//     const TakeOvers = await Qurey.getMany();
//     res.json(TakeOvers);
// }

// exports.getTakeOverOne = async function(req, res){
//     const TakeOverRepository = getRepository(TakeOverEntity);
//     try {
//         let Qurey = TakeOverRepository.createQueryBuilder("TAKE_OVER")
//                     .where("SEQ = :seq", { seq : req.body.seq })
//                     .leftJoinAndSelect("TAKE_OVER.FROM", "FROM")
//                     .leftJoinAndSelect("TAKE_OVER.TO", "TO")

//         const TakeOver = await Qurey.getOne();
//         return TakeOver;
//     } catch(err){
//         return err;
//     }
// }

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

    const AllUsers = await Query.getMany();

    res.json(AllUsers);
}
