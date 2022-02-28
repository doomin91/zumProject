"use strict";
const db = require("../lib/database");

const ApplyEntity = require("../entities/Apply");
const ApplyTagEntity = require("../entities/ApplyTag");
const UserEntity = require("../entities/User");
const UserActionEntity = require("../entities/UserAction");
const ApplyConfirmEntity = require("../entities/ApplyConfirm");
const ApplyAttachEntity = require("../entities/ApplyAttach");
const ApplyRuleEntity = require("../entities/ApplyRule");
const ApplyNatRuleEntity = require("../entities/ApplyNatRule");
const ApplyRuleBackUpEntity = require("../entities/ApplyRuleBackUp");
const ApplyNatRuleBackUpEntity = require("../entities/ApplyNatRuleBackUp");
const MailFormEntity = require("../entities/MailForm");
const { getRepository, Brackets } = require("typeorm");
import {getCurrentDate, getExtension} from "../lib/common";

exports.checkApplyInWriting = async function(req, res){
    const UserSeq = req.params.userId;
    const ApplyRepository = getRepository(ApplyEntity);

    try{ 
        const Apply = await ApplyRepository
                                .createQueryBuilder("APPLY")
                                .where(`APPLY.USER_SEQ=${UserSeq}`)
                                .andWhere("APPLY.APPLY_STATUS IN (0, 1)")
                                .andWhere("APPLY.APPLY_DEL_YN = 'N'")
                                .getOne();
        console.log(Apply);
        return Apply;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteApplyInWriting = async function(req, res){
    const ApplySeq = req.body.APPLY_SEQ;
    const ApplyRepository = getRepository(ApplyEntity);

    try{
        const Result = ApplyRepository
                                .createQueryBuilder("APPLY")
                                .update()
                                .set({
                                    APPLY_DEL_YN: 'Y'
                                })
                                .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq}).execute();
        return Result;                        
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getApply = async function(req, res){
    const ApplySeq = req.params.id;
    const ApplyRepository = getRepository(ApplyEntity);

    try{ 
        const Apply = await ApplyRepository
                                .createQueryBuilder("APPLY")
                                .innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `CONFIRM.APPLY_SEQ=${ApplySeq}`)
                                .leftJoinAndSelect("APPLY.RULES", "RULE", `RULE.APPLY_SEQ=${ApplySeq} AND RULE.DEL_YN='N'`)
                                .leftJoinAndSelect("APPLY.NAT_RULES", "NAT_RULE", `NAT_RULE.APPLY_SEQ=${ApplySeq} AND NAT_RULE.DEL_YN='N'`)
                                .leftJoinAndSelect("APPLY.ATTACHES", "ATTACH", `ATTACH.APPLY_SEQ=${ApplySeq}`)
                                .where(`APPLY.APPLY_SEQ=${ApplySeq}`)
                                .getOne();
        // console.log(Apply);
        return Apply;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getApplyStatus = async function(req, res){
    const ApplySeq = req.params.id;
    const ApplyRepository = getRepository(ApplyEntity);

    try{ 
        const Apply = await ApplyRepository
                                .createQueryBuilder("APPLY")
                                .select("APPLY.APPLY_STATUS")
                                .addSelect("APPLY.USER_SEQ")
                                .addSelect("APPLY.APPLY_DEL_YN")
                                .where(`APPLY.APPLY_SEQ=${ApplySeq}`)
                                .getOne();
        console.log(Apply);
        return Apply;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getApplyFromSeq = async function(applySeq){
    const ApplySeq = applySeq;
    const ApplyRepository = getRepository(ApplyEntity);
    try{ 
        const Apply = await ApplyRepository
                                .createQueryBuilder("APPLY")
                                .where(`APPLY.APPLY_SEQ=${ApplySeq}`)
                                .getOne();
        return Apply;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getApplies = async function(req, res){
    const ApplyRepository = getRepository(ApplyEntity);
    const UserRepository = getRepository(UserEntity);
    const ApplyConfirmRepository = getRepository(ApplyConfirmEntity);
    const ApplyRuleRepository = getRepository(ApplyRuleEntity);
    const ApplyNatRuleRepository = getRepository(ApplyNatRuleEntity);
    const QueryString  = req.query;
    const UserSeq = req.params.userId;
    const UserAuth = req.params.userAuth;
    const Flag = req.params.flag;

    let ApplyQuery = ApplyRepository
                            .createQueryBuilder("APPLY")
                            .where("APPLY.APPLY_DEL_YN = 'N'");

    // 신청상태값 
    // 0 : 신청서 처음 제출, 1 : 정책까지 제출, 2 : 신청서 제출, 3 : 1명이라고 결재 해서 결재중, 4 : 결재 완료 및 작업 결재 대기
    // 5 : 작업 결재 신청 제출, 6 : 작업 결재 1명이라도 해서 결재 중, 7 : 작업 결재 완료 및 작업 대기, 8 : 작업 완료
    // if(UserAuth == 'N'){
    //     ApplyQuery.andWhere(`APPLY.USER_SEQ = ${UserSeq}`);
    // }
    
    console.log(Flag);  
    console.log(UserAuth);
    if(Flag === "myApp"){
        if(UserAuth == 'N'){
            ApplyQuery.andWhere(`APPLY.USER_SEQ = ${UserSeq}`);
        } 
    }else if(Flag === "wrk" && UserAuth === 'Y'){
        ApplyQuery.andWhere(`APPLY.APPLY_STATUS = 7`);
    }else if(Flag == "complWrk" && UserAuth === 'Y'){
        ApplyQuery.andWhere(`APPLY.APPLY_STATUS = 8`);
    }else if(Flag == "compleDept"){
        const UserQuery = UserRepository
                            .createQueryBuilder("USER")
                            .select("USER.USER_DEPARTMENT")
                            .where(`USER.USER_SEQ = ${UserSeq}`);

        ApplyQuery.andWhere("APPLY.APPLY_USER_DEPARTMENT_SEQ IN (" + UserQuery.getQuery() +")");
        ApplyQuery.andWhere(`APPLY.APPLY_STATUS IN (-1, -2, 8)`);
    }else if(Flag == "cC"){
        const ApplyConfirmQuery = ApplyConfirmRepository
                                                .createQueryBuilder("CONFIRM")
                                                .select("CONFIRM.APPLY_SEQ")
                                                .where(`CONFIRM.CONFIRM_USER_SEQ = ${UserSeq}`)
                                                .andWhere("CONFIRM.CONFIRM_FLAG IN (2,4,6)");
        
        ApplyQuery.andWhere("APPLY.APPLY_SEQ IN (" + ApplyConfirmQuery.getQuery() +")");
    }else if(Flag == "unChked"){
        // 신청상태값 0 : 신청서 처음 제출, 1 : 정책까지 제출, 2 : 신청서 제출, 3 : 1명이라고 결재 해서 결재중, 4 : 결재 완료 및 작업 결재 대기, 5 : 작업 결재 신청 제출, 6 : 작업 결재 1명이라도 해서 결재 중, 7 : 작업 결재 완료 및 작업 대기, 8 : 작업 완료, -1: 일반 결재 반려, -2: 작업 결재 반려
        // const ApplyConfirmQuery = ApplyConfirmRepository
        //                                         .createQueryBuilder("CONFIRM")
        //                                         .select("CONFIRM.APPLY_SEQ")
        //                                         .where(`CONFIRM.CONFIRM_USER_SEQ = ${USER_SEQ}`)
        //                                         .andWhere("CONFIRM.CONFIRM_FLAG IN (1,3,5)")
        //                                         .andWhere("CONFIRM.CONFIRM_STATUS = 'W'");
        // ApplyQuery.innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `(((APPLY.APPLY_CONFIRM_ORDER = CONFIRM.CONFIRM_ORDER AND CONFIRM.CONFIRM_FLAG = 1) OR (APPLY.RECEPTION_CONFIRM_ORDER = CONFIRM.CONFIRM_ORDER AND CONFIRM.CONFIRM_FLAG = 3)) AND CONFIRM.CONFIRM_STATUS='W' AND CONFIRM.CONFIRM_USER_SEQ=${UserSeq}) OR APPLY.APPLY_STATUS = 4`);
        if(UserAuth ==='Y'){
            ApplyQuery.innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `(((APPLY.APPLY_CONFIRM_ORDER = CONFIRM.CONFIRM_ORDER AND CONFIRM.CONFIRM_FLAG = 1) OR (APPLY.RECEPTION_CONFIRM_ORDER = CONFIRM.CONFIRM_ORDER AND CONFIRM.CONFIRM_FLAG = 3)) AND CONFIRM.CONFIRM_STATUS='W' AND CONFIRM.CONFIRM_USER_SEQ=${UserSeq}) OR APPLY.APPLY_STATUS = 4`);
        }else{
            ApplyQuery.innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `(((APPLY.APPLY_CONFIRM_ORDER = CONFIRM.CONFIRM_ORDER AND CONFIRM.CONFIRM_FLAG = 1) OR (APPLY.RECEPTION_CONFIRM_ORDER = CONFIRM.CONFIRM_ORDER AND CONFIRM.CONFIRM_FLAG = 3)) AND CONFIRM.CONFIRM_STATUS='W' AND CONFIRM.CONFIRM_USER_SEQ=${UserSeq})`);
        }
    }else if(Flag == "inProg"){
        ApplyQuery.innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `(((APPLY.APPLY_CONFIRM_ORDER > CONFIRM.CONFIRM_ORDER AND CONFIRM.CONFIRM_FLAG = 1) OR (APPLY.RECEPTION_CONFIRM_ORDER > CONFIRM.CONFIRM_ORDER AND CONFIRM.CONFIRM_FLAG = 3)) AND CONFIRM.CONFIRM_STATUS='C' AND CONFIRM.CONFIRM_USER_SEQ=${UserSeq}) OR APPLY.USER_SEQ=${UserSeq} OR APPLY.APPLY_RECEPT_USER_SEQ=${UserSeq}`);
        if(UserAuth ==='Y'){
            ApplyQuery.andWhere("APPLY.APPLY_STATUS IN (2, 3, 5, 6)");
        }else{
            ApplyQuery.andWhere("APPLY.APPLY_STATUS < 8");
            ApplyQuery.andWhere("APPLY.APPLY_STATUS > 1");
        }
        
        
        
    }else if(Flag == "comple"){
        if(UserAuth == 'N'){
            ApplyQuery.andWhere(`APPLY.USER_SEQ = ${UserSeq}`);
        } 
        ApplyQuery.andWhere(`APPLY.APPLY_STATUS IN (-1, 2, 8)`);
    }else if(Flag == "changeApply"){
        ApplyQuery.andWhere(`APPLY.USER_SEQ = ${UserSeq}`);
    }

    if(Object.keys(QueryString).length === 0){
        // 검색 안하고 전체
        const Applies = await ApplyQuery
                                    .groupBy("APPLY.APPLY_SEQ")
                                    .orderBy("APPLY.APPLY_SEQ", "DESC")
                                    .getMany();

        console.log(ApplyQuery.getQuery());

        return Applies;
    }else{
        // 검색
        const StartDate = req.query.startDate;
        const EndDate = req.query.endDate;
        const SearchField = req.query.searchField;
        const SearchString = req.query.searchString;
        

        if(StartDate !== ""){
            console.log(StartDate);
            ApplyQuery.andWhere(`APPLY.APPLY_REG_DATE >= '${StartDate}'`);
        }
        if(EndDate !== ""){
            console.log(EndDate);
            ApplyQuery.andWhere(`APPLY.APPLY_REG_DATE <= '${EndDate}'`);
        }

        if(SearchField !== "all"){
            if(SearchField === "APPLY_NUMBER" || SearchField === "APPLY_TITLE" || SearchField === "APPLY_USER_NAME" ){
                ApplyQuery.andWhere(`APPLY.${SearchField} like :field`, {field: `%${SearchString}%`});
            }else{
                if(SearchField === "tag"){
                    ApplyQuery.innerJoinAndSelect("APPLY.TAGS", "TAGS", `TAGS.NAME='${SearchString}'`)
                }else if(SearchField === "SOURCE" || SearchField === "DESTINATION" || SearchField === "SERVICE"){
                    const ApplyRuleQuery = ApplyRuleRepository
                                                .createQueryBuilder("RULE")
                                                .select(`RULE.APPLY_SEQ`)
                                                .where(`RULE.${SearchField} like '%${SearchString}%'`);
                    const ApplyNatRuleQuery = ApplyNatRuleRepository
                                                .createQueryBuilder("NAT_RULE")
                                                .select(`NAT_RULE.APPLY_SEQ`)
                                                .where(`NAT_RULE.${SearchField} like '%${SearchString}%'`)
                    const ApplyNatRuleQuery2 = ApplyNatRuleRepository
                                                .createQueryBuilder("NAT_RULE")
                                                .select(`NAT_RULE.APPLY_SEQ`)
                                                .where(`NAT_RULE.T_${SearchField} like '%${SearchString}%'`)
                    ApplyQuery
                            .andWhere(new Brackets(qb => {
                                qb.where("APPLY.APPLY_SEQ IN (" + ApplyRuleQuery.getQuery() +")")
                                    .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleQuery.getQuery() +")")
                                    .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleQuery2.getQuery() +")");
                            }))
                }
            }
        }else{
            const ApplyRuleSourceQuery = ApplyRuleRepository
                                                .createQueryBuilder("RULE")
                                                .select(`RULE.APPLY_SEQ`)
                                                .where(`RULE.SOURCE like '%${SearchString}%'`);
            const ApplyNatRuleSourceQuery = ApplyNatRuleRepository
                                                    .createQueryBuilder("NAT_RULE")
                                                    .select(`NAT_RULE.APPLY_SEQ`)
                                                    .where(`NAT_RULE.SOURCE like '%${SearchString}%'`);
            const ApplyNatRuleTSourceQuery = ApplyNatRuleRepository
                                                    .createQueryBuilder("NAT_RULE")
                                                    .select(`NAT_RULE.APPLY_SEQ`)
                                                    .where(`NAT_RULE.T_SOURCE like '%${SearchString}%'`);
            const ApplyRuleDestinationQuery = ApplyRuleRepository
                                                .createQueryBuilder("RULE")
                                                .select(`RULE.APPLY_SEQ`)
                                                .where(`RULE.DESTINATION like '%${SearchString}%'`);
            const ApplyNatRuleDestinationQuery = ApplyNatRuleRepository
                                                    .createQueryBuilder("NAT_RULE")
                                                    .select(`NAT_RULE.APPLY_SEQ`)
                                                    .where(`NAT_RULE.DESTINATION like '%${SearchString}%'`);
            const ApplyNatRuleTDestinationQuery = ApplyNatRuleRepository
                                                    .createQueryBuilder("NAT_RULE")
                                                    .select(`NAT_RULE.APPLY_SEQ`)
                                                    .where(`NAT_RULE.T_DESTINATION like '%${SearchString}%'`);
            const ApplyRuleServiceQuery = ApplyRuleRepository
                                                .createQueryBuilder("RULE")
                                                .select(`RULE.APPLY_SEQ`)
                                                .where(`RULE.SERVICE like '%${SearchString}%'`);
            const ApplyNatRuleServiceQuery = ApplyNatRuleRepository
                                                    .createQueryBuilder("NAT_RULE")
                                                    .select(`NAT_RULE.APPLY_SEQ`)
                                                    .where(`NAT_RULE.SERVICE like '%${SearchString}%'`);
            ApplyQuery
                    .andWhere(new Brackets(qb => {
                        qb.where(`APPLY.APPLY_TITLE like :APPLY_TITLE`, {APPLY_TITLE: `%${SearchString}%`})
                            .orWhere(`APPLY.APPLY_NUMBER like :APPLY_NUMBER`, {APPLY_NUMBER: `%${SearchString}%`})
                            .orWhere(`APPLY.APPLY_USER_NAME like :APPLY_USER_NAME`, {APPLY_USER_NAME: `%${SearchString}%`})
                            .orWhere("APPLY.APPLY_SEQ IN (" + ApplyRuleSourceQuery.getQuery() +")")
                            .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleSourceQuery.getQuery() +")")
                            .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleTSourceQuery.getQuery() +")")
                            .orWhere("APPLY.APPLY_SEQ IN (" + ApplyRuleDestinationQuery.getQuery() +")")
                            .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleDestinationQuery.getQuery() +")")
                            .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleTDestinationQuery.getQuery() +")")
                            .orWhere("APPLY.APPLY_SEQ IN (" + ApplyRuleServiceQuery.getQuery() +")")
                            .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleServiceQuery.getQuery() +")")
                    }))
                    .groupBy("APPLY.APPLY_SEQ")
                    .orderBy("APPLY.APPLY_SEQ", "DESC");
                  
        }

        console.log(ApplyQuery.getQuery());

        const Applies = await ApplyQuery.getMany();

        return Applies;
       
    }

    
    

    // const Applies = await ApplyRepository.createQueryBuilder("APPLY").getMany();
    // const ApplyConfirm = await ApplyRepository.find({ relations: ["confirms"] });
    // console.log(req);
    // console.log("---------------------------------");
    // console.log(res);
    // const users = await ApplyRepository
    // .createQueryBuilder("APPLY")
    // .leftJoinAndSelect("APPLY.confirms", "test", "test.CONFIRM_ORDER = 1")
    // .getMany();
    // return await this.postRepository.find({
    //     relations: ['images', 'user'],
    //     where: { user: { id: id } },
    //   });
    // console.log(users[0]);
}

exports.getMyApplies = async (req, res) => {
    const UserSeq = req.params.userId;
    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyRuleRepository = getRepository(ApplyRuleEntity);
    const ApplyNatRuleRepository = getRepository(ApplyNatRuleEntity);

    const QueryString  = req.query;

    let ApplyQuery = ApplyRepository
                            .createQueryBuilder("APPLY")
                            .leftJoinAndSelect("APPLY.RULES", "RULE", "RULE.DEL_YN='N'")
                            .leftJoinAndSelect("APPLY.NAT_RULES", "NAT_RULE", "NAT_RULE.DEL_YN='N'")
                            .where("APPLY.APPLY_DEL_YN = 'N'")
                            .andWhere("APPLY.APPLY_STATUS = 8");
                            
    ApplyQuery.andWhere(`APPLY.USER_SEQ = ${UserSeq}`);

    if(Object.keys(QueryString).length === 0){
        // 검색 안하고 전체
        const Applies = await ApplyQuery.getMany();

        console.log(ApplyQuery.getQuery());

        return Applies;
    }else{
        // 검색
        const SearchString = req.query.searchString;

        
        const ApplyRuleSourceQuery = ApplyRuleRepository
                                            .createQueryBuilder("RULE")
                                            .select(`RULE.APPLY_SEQ`)
                                            .where(`RULE.SOURCE like '%${SearchString}%'`);
        const ApplyNatRuleSourceQuery = ApplyNatRuleRepository
                                                .createQueryBuilder("NAT_RULE")
                                                .select(`NAT_RULE.APPLY_SEQ`)
                                                .where(`NAT_RULE.SOURCE like '%${SearchString}%'`);
        const ApplyNatRuleTSourceQuery = ApplyNatRuleRepository
                                                .createQueryBuilder("NAT_RULE")
                                                .select(`NAT_RULE.APPLY_SEQ`)
                                                .where(`NAT_RULE.T_SOURCE like '%${SearchString}%'`);
        const ApplyRuleDestinationQuery = ApplyRuleRepository
                                            .createQueryBuilder("RULE")
                                            .select(`RULE.APPLY_SEQ`)
                                            .where(`RULE.DESTINATION like '%${SearchString}%'`);
        const ApplyNatRuleDestinationQuery = ApplyNatRuleRepository
                                                .createQueryBuilder("NAT_RULE")
                                                .select(`NAT_RULE.APPLY_SEQ`)
                                                .where(`NAT_RULE.DESTINATION like '%${SearchString}%'`);
        const ApplyNatRuleTDestinationQuery = ApplyNatRuleRepository
                                                .createQueryBuilder("NAT_RULE")
                                                .select(`NAT_RULE.APPLY_SEQ`)
                                                .where(`NAT_RULE.T_DESTINATION like '%${SearchString}%'`);
        const ApplyRuleServiceQuery = ApplyRuleRepository
                                            .createQueryBuilder("RULE")
                                            .select(`RULE.APPLY_SEQ`)
                                            .where(`RULE.SERVICE like '%${SearchString}%'`);
        const ApplyNatRuleServiceQuery = ApplyNatRuleRepository
                                                .createQueryBuilder("NAT_RULE")
                                                .select(`NAT_RULE.APPLY_SEQ`)
                                                .where(`NAT_RULE.SERVICE like '%${SearchString}%'`);
        ApplyQuery
                .andWhere(new Brackets(qb => {
                    qb.where(`APPLY.APPLY_TITLE like :APPLY_TITLE`, {APPLY_TITLE: `%${SearchString}%`})
                        .orWhere(`APPLY.APPLY_NUMBER like :APPLY_NUMBER`, {APPLY_NUMBER: `%${SearchString}%`})
                        .orWhere(`APPLY.APPLY_USER_NAME like :APPLY_USER_NAME`, {APPLY_USER_NAME: `%${SearchString}%`})
                        .orWhere("APPLY.APPLY_SEQ IN (" + ApplyRuleSourceQuery.getQuery() +")")
                        .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleSourceQuery.getQuery() +")")
                        .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleTSourceQuery.getQuery() +")")
                        .orWhere("APPLY.APPLY_SEQ IN (" + ApplyRuleDestinationQuery.getQuery() +")")
                        .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleDestinationQuery.getQuery() +")")
                        .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleTDestinationQuery.getQuery() +")")
                        .orWhere("APPLY.APPLY_SEQ IN (" + ApplyRuleServiceQuery.getQuery() +")")
                        .orWhere("APPLY.APPLY_SEQ IN (" + ApplyNatRuleServiceQuery.getQuery() +")")
                }))
                .groupBy("APPLY.APPLY_SEQ");

        console.log(ApplyQuery.getQuery());

        const Applies = await ApplyQuery.getMany();

        return Applies;
       
    }
    
}

exports.getApplyCopyData = async (req, res) => {
    const ApplySeq = req.params.id;
    const ApplyRepository = getRepository(ApplyEntity);

    try{ 
        const Apply = await ApplyRepository
                                .createQueryBuilder("APPLY")
                                .innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `CONFIRM.APPLY_SEQ=${ApplySeq}`)
                                .where(`APPLY.APPLY_SEQ=${ApplySeq}`)
                                .getOne();
        console.log(Apply);
        return Apply;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkCopyData = async (req, res) => {
    const ApplySeq = req.params.id;
    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyRuleRepository = getRepository(ApplyRuleEntity);
    const ApplyNatRuleRepository = getRepository(ApplyNatRuleEntity);

    try{ 
        const CurrentApply = await ApplyRepository
                                    .createQueryBuilder("APPLY")
                                    .where(`APPLY.APPLY_SEQ=${ApplySeq}`)
                                    .leftJoinAndSelect("APPLY.ATTACHES", "ATTACH", `ATTACH.APPLY_SEQ=${ApplySeq}`)
                                    .innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `CONFIRM.APPLY_SEQ=${ApplySeq}`)
                                    .getOne();

        const Apply = await ApplyRepository
                                .createQueryBuilder("APPLY")
                                .select("APPLY.COPY_APPLY_SEQ")
                                .where(`APPLY.APPLY_SEQ=${ApplySeq}`)
                                .getOne();

        const Rules = await ApplyRuleRepository
                            .createQueryBuilder("RULE")
                            .where(`RULE.APPLY_SEQ=${Apply.COPY_APPLY_SEQ}`)
                            .andWhere("RULE.DEL_YN ='N'")
                            .getMany();

        const NatRules = await ApplyNatRuleRepository
                                .createQueryBuilder("NAT_RULE")
                                .where(`NAT_RULE.APPLY_SEQ=${Apply.COPY_APPLY_SEQ}`)
                                .andWhere("NAT_RULE.DEL_YN ='N'")
                                .getMany();

        return [CurrentApply, Rules, NatRules];
        
        
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getLatestConfirmLine = async (req, res) => {
    const Flag = req.params.flag;
    const UserSeq = req.params.userId;
    const ApplyRepository = getRepository(ApplyEntity);
    try{
        const LatestApply = await ApplyRepository
            .createQueryBuilder("APPLY")
            .innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `CONFIRM.CONFIRM_FLAG=${Flag}`)
            .where(`APPLY.USER_SEQ=${UserSeq}`)
            .orderBy("APPLY.APPLY_REG_DATE", "DESC")
            .getOne();
        const LastestConfirms = LatestApply.CONFIRMS;

        // console.log(LastestConfirms[0]);
        return LastestConfirms;
    }catch(err){
        return err;
    }
    
}

exports.getCurrentUserInfo = async (req, res) => {
    const UserSeq = req.params.userId;
    const UserRepository = getRepository(UserEntity);
    try{
        const UserInfo = await UserRepository
            .createQueryBuilder("USER")
            .innerJoinAndSelect("USER.DEPART_INFO", "DEPT")
            .innerJoinAndSelect("USER.POSITION_INFO", "POSITTION")
            .where(`USER.USER_SEQ=${UserSeq}`)
            .getOne();
            
        return UserInfo;
    }catch(err){
        return err;
    }
    
}

exports.saveAppForm = async (req, res) => {
    const ConfirmLine = JSON.parse(req.body.ConfirmLine);
    const CcLine = JSON.parse(req.body.CcLine);
    const Apply = JSON.parse(req.body.Apply);
    const Files = req.files;
    const ApplyWithAction = addLastAction(Apply, "saveAppForm", getCurrentDate("Y-m-d H:i:s"));
    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyConfirmRepository = getRepository(ApplyConfirmEntity);
    const ApplyAttachRepository = getRepository(ApplyAttachEntity);
    
    try{
        const ApplyQuery = ApplyRepository
                                    .createQueryBuilder("APPLY")
                                    .insert()
                                    .values([ApplyWithAction]);

        let ActionInsertId;
        await createUserAction(Apply.USER_SEQ, "TBL_FW_APPLY", "saveAppForm", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    ActionInsertId = res.raw.insertId;
                });

        const Result = await ApplyQuery.execute().catch((err)=> {
            console.log(err);
            updateUserAction(ActionInsertId, "TBL_FW_APPLY", err.sqlMessage);
        });
        
        const ApplyInsertId = Result.raw.insertId;
        
        ConfirmLine.forEach((val, index) =>{
            val.APPLY_SEQ = ApplyInsertId;
            val.CONFIRM_FLAG = 1;
            val.CONFIRM_ORDER = index+1;
            val.CONFIRM_STATUS = 'W';
            // console.log(index);
        })
        CcLine.forEach((val, index) =>{
            val.APPLY_SEQ = ApplyInsertId;
            val.CONFIRM_FLAG = 2;
            val.CONFIRM_ORDER = index+1;
            val.CONFIRM_STATUS = 'W';
        })
        const ApplyConfirmQuery = ApplyConfirmRepository
                                                .createQueryBuilder("CONFIRM")
                                                .insert()
                                                .values(ConfirmLine);

        const ApplyCcQuery = ApplyConfirmRepository
                                            .createQueryBuilder("Cc")
                                            .insert()
                                            .values(CcLine);
        
        const LineResult = await Promise.all([ApplyConfirmQuery.execute(), ApplyCcQuery.execute()]).catch((err)=> {
            console.log(err);
            updateUserAction(ActionInsertId, "TBL_FW_APPLY_CONFIRM", err.sqlMessage);
        });
        
        const FileNames = [];
        const OriginFileNames = [];
        if(Files){
            let Index = 0;
            for (const [key, value] of Object.entries(Files)){
                // try{
                //     const Ext = getExtension(value.name);
                //     console.log(Ext);
                // }catch(err){
                //     console.log(err);
                // }
                const Ext = getExtension(value.name);
                const FilePath = "/upload/apply/";
                const FileName = "APPLY" + getCurrentDate("YmdHis") + Index +"." + Ext;
                Index++;
                console.log(Ext);
                console.log(FilePath);
                console.log(FileName);
                value.mv("."+FilePath+FileName, function(err){
                    if(err)
                        console.log(err);

                    FileNames.push(FileName);
                    OriginFileNames.push(value.name);
                    
                    ApplyAttachRepository
                            .createQueryBuilder("ATTACH")
                            .insert()
                            .values([
                                {   "APPLY_SEQ" : Apply.APPLY_SEQ,
                                    "APPLY_NUMBER" : Apply.APPLY_NUMBER,
                                    "FILE_NAME": value.name,
                                    "FILE_PATH": FilePath+FileName
                            }]).execute();

                    console.log("Upload Success!");
                });
            }
        }        

        return Result;
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY", "FAIL("+err.errno+") : "+err.code);
        console.log(err);
        
        return err;
    }
}

exports.editAppForm = async (req, res) => {
    const ConfirmLine = JSON.parse(req.body.ConfirmLine);
    const CcLine = JSON.parse(req.body.CcLine);
    const Apply = JSON.parse(req.body.Apply);
    const ApplySeq = Apply.APPLY_SEQ;
    const Files = req.files;
    const DeletedFiles = JSON.parse(req.body.DeletedFileList);
    // const ApplyWithAction = addLastAction(Apply, "editAppForm", getCurrentDate("Y-m-d H:i:s"));
    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyConfirmRepository = getRepository(ApplyConfirmEntity);
    const ApplyAttachRepository = getRepository(ApplyAttachEntity);
    

    // console.log(ConfirmLine);
    // console.log(CcLine);
    console.log(Files);
    console.log(DeletedFiles);

    try{
        const ApplyQuery = ApplyRepository
                                    .createQueryBuilder("APPLY")
                                    .update()
                                    .set({
                                        APPLY_TITLE: Apply.APPLY_TITLE,
                                        APPLY_LAST_ACTION: "editAppForm",
                                        APPLY_ACTION_DATE: 1,

                                    })
                                    .where(`APPLY_SEQ=${ApplySeq}`);

        // const ActionInsertId = createUserAction(Apply.USER_SEQ, "TBL_FW_APPLY", "editAppForm", "SUCCESS");
        let ActionInsertId;
        await createUserAction(Apply.USER_SEQ, "TBL_FW_APPLY", "editAppForm", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    ActionInsertId = res.raw.insertId;
                });

        const Result = await ApplyQuery.execute().catch((err)=> {
            console.log(err);
            updateUserAction(ActionInsertId, "TBL_FW_APPLY", err.sqlMessage);
        });
        
        const ApplyConfirmDeleteQuery = ApplyConfirmRepository
                                .createQueryBuilder()
                                .delete()
                                .from("CONFIRM")
                                .where(`APPLY_SEQ = ${ApplySeq}`);

        await ApplyConfirmDeleteQuery.execute().catch((err)=>{
            console.log(err);
            updateUserAction(ActionInsertId, "TBL_FW_APPLY_CONFIRM", err.sqlMessage);
        });
        
        ConfirmLine.forEach((val, index) =>{
            val.APPLY_SEQ = ApplySeq;
            val.CONFIRM_FLAG = 1;
            val.CONFIRM_ORDER = index+1;
            val.CONFIRM_STATUS = 'W';
            // console.log(index);
        })
        CcLine.forEach((val, index) =>{
            val.APPLY_SEQ = ApplySeq;
            val.CONFIRM_FLAG = 2;
            val.CONFIRM_ORDER = index+1;
            val.CONFIRM_STATUS = 'W';
        })
        const ApplyConfirmQuery = ApplyConfirmRepository
                                                .createQueryBuilder("CONFIRM")
                                                .insert()
                                                .values(ConfirmLine);

        const ApplyCcQuery = ApplyConfirmRepository
                                            .createQueryBuilder("Cc")
                                            .insert()
                                            .values(CcLine);
        
        const LineResult = await Promise.all([ApplyConfirmQuery.execute(), ApplyCcQuery.execute()]).catch((err)=> {
            console.log(err);
            updateUserAction(ActionInsertId, "TBL_FW_APPLY_CONFIRM", err.sqlMessage);
        });

        if(DeletedFiles.length > 0){
            const ApplyAttachDeleteQuery = ApplyConfirmRepository
                                .createQueryBuilder()
                                .delete()
                                .from("APPLY_ATTACH")
                                .where(`seq IN (:SEQ)`, {SEQ: DeletedFiles})

            await ApplyAttachDeleteQuery.execute().catch((err)=>{
                console.log(err);
                updateUserAction(ActionInsertId, "TBL_FW_APPLY_ATTACH", err.sqlMessage);
            });
        }
        
        const FileNames = [];
        const OriginFileNames = [];
        if(Files){
            let Index = 0;
            for (const [key, value] of Object.entries(Files)){
                // try{
                //     const Ext = getExtension(value.name);
                //     console.log(Ext);
                // }catch(err){
                //     console.log(err);
                // }
                const Ext = getExtension(value.name);
                const FilePath = "/upload/apply/";
                const FileName = "APPLY" + getCurrentDate("YmdHis") + Index +"." + Ext;
                Index++;
                console.log(Ext);
                console.log(FilePath);
                console.log(FileName);
                value.mv("."+FilePath+FileName, function(err){
                    if(err)
                        console.log(err);

                    FileNames.push(FileName);
                    OriginFileNames.push(value.name);
                    
                    ApplyAttachRepository
                            .createQueryBuilder("ATTACH")
                            .insert()
                            .values([
                                {   "APPLY_SEQ" : Apply.APPLY_SEQ,
                                    "APPLY_NUMBER" : Apply.APPLY_NUMBER,
                                    "FILE_NAME": value.name,
                                    "FILE_PATH": FilePath+FileName
                            }]).execute();

                    console.log("Upload Success!");
                });
            }
        }        

        return Result;
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY", "FAIL("+err.errno+") : "+err.code);
        console.log(err);
        
        return err;
    }
}

exports.saveAppForm2 = async (req, res) => {
    const ApplySeq = req.body.ApplySeq;
    const UserSeq = req.body.UserSeq;
    
    let Rules = [];
    let NatRules = [];
    if(req.body.hasOwnProperty('Rules')){
        Rules = JSON.parse(req.body.Rules);
    }
    
    if(req.body.hasOwnProperty('NatRules')){
        NatRules = JSON.parse(req.body.NatRules);    
    }
    
    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyRuleRepository = getRepository(ApplyRuleEntity);
    const ApplyNatRuleRepository = getRepository(ApplyNatRuleEntity);

    try{
        // const ActionInsertId = createUserAction(UserSeq, "TBL_FW_APPLY_RULE", "saveAppForm2", "SUCCESS");
        let ActionInsertId;
        await createUserAction(UserSeq, "TBL_FW_APPLY", "saveAppForm2", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    ActionInsertId = res.raw.insertId;
                });
        console.log(ActionInsertId);
        const ApplyQuery = ApplyRepository
                                .createQueryBuilder("APPLY")
                                .update()
                                .set({
                                    APPLY_STATUS: 1
                                })
                                .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq});

        const ApplyRuleQuery = ApplyRuleRepository
                                    .createQueryBuilder("RULE")
                                    .insert()
                                    .values(Rules);

        const ApplyNatRuleQuery = ApplyNatRuleRepository
                                    .createQueryBuilder("NAT_RULE")
                                    .insert()
                                    .values(NatRules);
                                    console.log("TSET");

        const RuleResult = await Promise.all([ApplyQuery.execute(), ApplyRuleQuery.execute(), ApplyNatRuleQuery.execute()]).catch((err)=>{
            console.log(err);
            updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", err.sqlMessage);
        });                            

        return RuleResult;
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", "FAIL("+err.errno+") : "+err.code);
        console.log(err);
        
        return err;
    }
    
}

exports.editAppForm2 = async (req, res) => {
    const ApplySeq = req.body.ApplySeq;
    const UserSeq = req.body.UserSeq;
    let Rules = [];
    let NatRules = [];
    if(req.body.hasOwnProperty('Rules')){
        Rules = JSON.parse(req.body.Rules);
    }
    
    if(req.body.hasOwnProperty('NatRules')){
        NatRules = JSON.parse(req.body.NatRules);    
    }
    
    // const ApplyRepository = getRepository(ApplyEntity);
    const ApplyRuleRepository = getRepository(ApplyRuleEntity);
    const ApplyNatRuleRepository = getRepository(ApplyNatRuleEntity);

    console.log(ApplySeq);

    try{
        // const ActionInsertId = createUserAction(UserSeq, "TBL_FW_APPLY_RULE", "editAppForm2", "SUCCESS");
        let ActionInsertId;
        await createUserAction(UserSeq, "TBL_FW_APPLY", "editAppForm2", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    ActionInsertId = res.raw.insertId;
                });

        const ApplyRuleDeleteQuery = ApplyRuleRepository
                                .createQueryBuilder()
                                .delete()
                                .from("APPLY_RULE")
                                .where(`APPLY_SEQ = ${ApplySeq}`);

        const ApplyNatDeleteRuleQuery = ApplyNatRuleRepository
                                    .createQueryBuilder()
                                    .delete()
                                    .from("APPLY_NAT_RULE")
                                    .where(`APPLY_SEQ = ${ApplySeq}`);

        await Promise.all([ApplyRuleDeleteQuery.execute(), ApplyNatDeleteRuleQuery.execute()]).catch((err)=>{
            console.log(err);
            updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", err.sqlMessage);
        });

        const ApplyRuleQuery = ApplyRuleRepository
                                    .createQueryBuilder("RULE")
                                    .insert()
                                    .values(Rules);

        const ApplyNatRuleQuery = ApplyNatRuleRepository
                                    .createQueryBuilder("NAT_RULE")
                                    .insert()
                                    .values(NatRules);

        const RuleResult = await Promise.all([ApplyRuleQuery.execute(), ApplyNatRuleQuery.execute()]).catch((err)=>{
            console.log(err);
            updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", err.sqlMessage);
        });  

        return RuleResult;
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", "FAIL("+err.errno+") : "+err.code);
        console.log(err);
        
        return err;
    }
    
}

exports.saveApply = async (req, res) => {
    const ApplySeq = req.body.ApplySeq;
    const UserSeq = req.body.UserSeq;
    const ApplyRepository = getRepository(ApplyEntity);

    try{ 

        // const ActionInsertId = createUserAction(UserSeq, "TBL_FW_APPLY", "saveApply", "SUCCESS");
        let ActionInsertId;
        await createUserAction(UserSeq, "TBL_FW_APPLY", "saveApply", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    ActionInsertId = res.raw.insertId;
                });

        const Result = await ApplyRepository
                                .createQueryBuilder("APPLY")
                                .update()
                                .set({
                                    APPLY_STATUS: 2,
                                    APPLY_COMPLETE_DATE: getCurrentDate("Y-m-d H:i:s")
                                })
                                .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                                .execute().catch((err) => {
                                    console.log(err);
                                    updateUserAction(ActionInsertId, "TBL_FW_APPLY", err.sqlMessage);
                                });
        


        return Result;
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY", "FAIL("+err.errno+") : "+err.code);
        return err;
    }
}

exports.applyWork = async (req, res) => {
    const ApplySeq = req.body.ApplySeq;
    const UserSeq = req.body.UserSeq;
    const Tags = JSON.parse(req.body.Tags);
    const UpdateData = JSON.parse(req.body.UpdateData);
    const Confirms = JSON.parse(req.body.Confirms);
    const CCs = JSON.parse(req.body.CCs);
    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyConfirmRepository = getRepository(ApplyConfirmEntity);
    const ApplyTagRepository = getRepository(ApplyTagEntity);
    
    console.log(Confirms);
    try{
        UpdateData.APPLY_LAST_ACTION = "applyWork";
        UpdateData.APPLY_ACTION_DATE = getCurrentDate("Y-m-d H:i:s");
        UpdateData.APPLY_STATUS = 5;
        await createUserAction(UserSeq, "TBL_FW_APPLY", "applyWork", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    const ActionInsertId = res.raw.insertId;
                    ApplyRepository
                            .createQueryBuilder("APPLY")
                            .update()
                            .set(UpdateData)
                            .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                            .execute().catch((err) => {
                                console.log(err);
                                updateUserAction(ActionInsertId, "TBL_FW_APPLY", err.sqlMessage);
                            });
                    if(Confirms.length > 0){
                        ApplyConfirmRepository
                                    .createQueryBuilder("CONFIRM")
                                    .insert()
                                    .values(Confirms)
                                    .execute().catch((err) => {
                                        console.log(err);
                                        updateUserAction(ActionInsertId, "TBL_FW_APPLY_CONFIRM", err.sqlMessage);
                                    });
                    }
                    if(CCs.length > 0){
                        ApplyConfirmRepository
                                    .createQueryBuilder("CONFIRM")
                                    .insert()
                                    .values(CCs)
                                    .execute().catch((err) => {
                                        console.log(err);
                                        updateUserAction(ActionInsertId, "TBL_FW_APPLY_CONFIRM", err.sqlMessage);
                                    });
                    }
                    if(Tags.length > 0){
                        ApplyTagRepository
                                    .createQueryBuilder("TAG")
                                    .insert()
                                    .values(Tags)
                                    .execute().catch((err) => {
                                        console.log(err);
                                        updateUserAction(ActionInsertId, "TBL_FW_APPLY_TAG", err.sqlMessage);
                                    });
                    }

                });


        return {code: 200};
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY", "FAIL("+err.errno+") : "+err.code);
        return err;
    }
}

exports.editApplyAtWork = async (req, res) => {
    const ApplySeq = req.body.ApplySeq;
    const UserSeq = req.body.UserSeq;
    const ApplyTitle = req.body.ApplyTitle;
    let Rules = [];
    let NatRules = [];
    if(req.body.hasOwnProperty('Rules')){
        Rules = JSON.parse(req.body.Rules);
    }
    
    if(req.body.hasOwnProperty('NatRules')){
        NatRules = JSON.parse(req.body.NatRules);    
    }

    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyRuleRepository = getRepository(ApplyRuleEntity);
    const ApplyNatRuleRepository = getRepository(ApplyNatRuleEntity);
    const ApplyRuleBackUpRepository = getRepository(ApplyRuleBackUpEntity);
    const ApplyNatRuleBackUpRepository = getRepository(ApplyNatRuleBackUpEntity);

    try{ 

        await createUserAction(UserSeq, "TBL_FW_APPLY", "editApplyAtWork", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    const ActionInsertId = res.raw.insertId;
                    ApplyRepository
                            .createQueryBuilder("APPLY")
                            .update()
                            .set({
                                ADMIN_MODIFY_FLAG: 'Y',
                                ADMIN_TITLE: ApplyTitle,
                                APPLY_LAST_ACTION: "editApplyAtWork",
                                APPLY_ACTION_DATE: getCurrentDate("Y-m-d H:i:s")
                            })
                            .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                            .execute().catch((err) => {
                                console.log(err);
                                updateUserAction(ActionInsertId, "TBL_FW_APPLY", err.sqlMessage);
                            });
                    ApplyRuleRepository
                                .createQueryBuilder("RULE")
                                .update()
                                .set({
                                    DEL_YN: 'Y'
                                })
                                .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                                .execute().catch((err) => {
                                    console.log(err);
                                    updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE, NAT_RULE", err.sqlMessage);
                                });

                    if(Rules.length > 0){
                        const ToUpdate = [];
                        const ToInsert = [];
                        Rules.forEach( (rule) => {
                            if(rule.SEQ){
                                ToUpdate.push(rule);
                            }else{
                                rule.ADMIN_FLAG = 'Y';
                                rule.CHANGE_ITEMS = 'ALL';
                                ToInsert.push(rule);
                            }
                        })

                        console.log(ToUpdate);
                        console.log(ToInsert);
                        const ToUpdateSeqs = ToUpdate.reduce ( (acc, rule) => { acc.push(rule.SEQ); return acc;}, []);
                        if(ToUpdate.length > 0){
                            ApplyRuleRepository
                                    .createQueryBuilder("RULE")
                                    .where("SEQ IN (:SEQ)", {SEQ: ToUpdateSeqs})
                                    .getMany()
                                    .then((res) =>{
                                        console.log(res);
                                        const CurrentRulesToUpdate = res;

                                        CurrentRulesToUpdate.forEach( (old, index) =>{
                                            const New = ToUpdate[index];
                                            const UpdateValues = {
                                                DEL_YN: 'N',
                                                ADMIN_FLAG: 'Y'
                                            }
                
                                            let ChangeItems = "";
                                            if(old.SOURCE !== New.SOURCE){
                                                ChangeItems === "" ? ChangeItems += "SOURCE" : ChangeItems += ",SOURCE";
                                                UpdateValues.SOURCE = New.SOURCE;
                                            }
                                            if(old.DESTINATION !== New.DESTINATION){
                                                ChangeItems === "" ? ChangeItems += "DESTINATION" : ChangeItems += ",DESTINATION";
                                                UpdateValues.DESTINATION = New.DESTINATION;
                                            }
                                            if(old.SERVICE !== New.SERVICE){
                                                ChangeItems === "" ? ChangeItems += "SERVICE" : ChangeItems += ",SERVICE";
                                                UpdateValues.SERVICE = New.SERVICE;
                                            }
                                            if(old.EXPIRATION_DATE !== New.EXPIRATION_DATE){
                                                ChangeItems === "" ? ChangeItems += "EXPIRATION_DATE" : ChangeItems += ",EXPIRATION_DATE";
                                                UpdateValues.EXPIRATION_DATE = New.EXPIRATION_DATE;
                                            }
                                            if(old.DESCRIPTION !== New.DESCRIPTION){
                                                ChangeItems === "" ? ChangeItems += "DESCRIPTION" : ChangeItems += ",DESCRIPTION";
                                                UpdateValues.DESCRIPTION = New.DESCRIPTION;
                                            }
                
                                            UpdateValues.CHANGE_ITEMS = ChangeItems;
                
                                            ApplyRuleRepository
                                                        .createQueryBuilder("RULE")
                                                        .update()
                                                        .set(UpdateValues)
                                                        .where("SEQ = :SEQ", {SEQ: old.SEQ})
                                                        .execute().catch((err) => {
                                                            console.log(err);
                                                            updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", err.sqlMessage);
                                                        });

                                            
                                            
                                            const BackUpValues = {
                                                APPLY_SEQ: ApplySeq,
                                                SEQ: old.SEQ,
                                                REVERSE_FLAG: old.REVERSE_FLAG,
                                                SOURCE: old.SOURCE,
                                                DESTINATION: old.DESTINATION,
                                                SERVICE: old.SERVICE,
                                                EXPIRATION_DATE: old.EXPIRATION_DATE,
                                                DESCRIPTION: old.DESCRIPTION,
                                            };

                                            console.log(BackUpValues);
                                            ApplyRuleBackUpRepository
                                                            .createQueryBuilder("BACKUP_RULE")
                                                            .insert()
                                                            .values(BackUpValues)
                                                            .execute().catch((err) => {
                                                                console.log(err);
                                                                updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE_BACKUP", err.sqlMessage);
                                                            });
                                        })
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", err.sqlMessage);
                                    });
                        }
                        

                        ApplyRuleRepository
                                    .createQueryBuilder("RULE")
                                    .insert()
                                    .values(ToInsert)
                                    .execute().catch((err) => {
                                        console.log(err);
                                        updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", err.sqlMessage);
                                    });

                    }

                    if(NatRules.length > 0){
                        const ToUpdate = [];
                        const ToInsert = [];
                        NatRules.forEach( (rule) => {
                            if(rule.SEQ){
                                ToUpdate.push(rule);
                            }else{
                                rule.ADMIN_FLAG = 'Y';
                                rule.CHANGE_ITEMS = 'ALL';
                                ToInsert.push(rule);
                            }
                        })
                        const ToUpdateSeqs = ToUpdate.reduce ( (acc, rule) => { acc.push(rule.SEQ); return acc;}, []);
                        if(ToUpdate.length > 0){
                            ApplyNatRuleRepository
                                    .createQueryBuilder("RULE")
                                    .where("SEQ IN (:SEQ)", {SEQ: ToUpdateSeqs})
                                    .getMany()
                                    .then((res) =>{
                                        console.log(res);
                                        const CurrentRulesToUpdate = res;

                                        CurrentRulesToUpdate.forEach( (old, index) =>{
                                            const New = ToUpdate[index];
                                            const UpdateValues = {
                                                DEL_YN: 'N',
                                                ADMIN_FLAG: 'Y'
                                            }
                
                                            let ChangeItems = "";
                                            if(old.SOURCE !== New.SOURCE){
                                                ChangeItems === "" ? ChangeItems += "SOURCE" : ChangeItems += ",SOURCE";
                                                UpdateValues.SOURCE = New.SOURCE;
                                            }
                                            if(old.DESTINATION !== New.DESTINATION){
                                                ChangeItems === "" ? ChangeItems += "DESTINATION" : ChangeItems += ",DESTINATION";
                                                UpdateValues.DESTINATION = New.DESTINATION;
                                            }
                                            if(old.SERVICE !== New.SERVICE){
                                                ChangeItems === "" ? ChangeItems += "SERVICE" : ChangeItems += ",SERVICE";
                                                UpdateValues.SERVICE = New.SERVICE;
                                            }
                                            if(old.T_SOURCE !== New.T_SOURCE){
                                                ChangeItems === "" ? ChangeItems += "T_SOURCE" : ChangeItems += ",T_SOURCE";
                                                UpdateValues.T_SOURCE = New.T_SOURCE;
                                            }
                                            if(old.T_DESTINATION !== New.T_DESTINATION){
                                                ChangeItems === "" ? ChangeItems += "T_DESTINATION" : ChangeItems += ",T_DESTINATION";
                                                UpdateValues.T_DESTINATION = New.T_DESTINATION;
                                            }
                                            if(old.EXPIRATION_DATE !== New.EXPIRATION_DATE){
                                                ChangeItems === "" ? ChangeItems += "EXPIRATION_DATE" : ChangeItems += ",EXPIRATION_DATE";
                                                UpdateValues.EXPIRATION_DATE = New.EXPIRATION_DATE;
                                            }
                                            if(old.DESCRIPTION !== New.DESCRIPTION){
                                                ChangeItems === "" ? ChangeItems += "DESCRIPTION" : ChangeItems += ",DESCRIPTION";
                                                UpdateValues.DESCRIPTION = New.DESCRIPTION;
                                            }
                
                                            UpdateValues.CHANGE_ITEMS = ChangeItems;
                
                                            ApplyRuleRepository
                                                        .createQueryBuilder("RULE")
                                                        .update()
                                                        .set(UpdateValues)
                                                        .where("SEQ = :SEQ", {SEQ: old.SEQ})
                                                        .execute().catch((err) => {
                                                            console.log(err);
                                                            updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", err.sqlMessage);
                                                        });
                                            
                                            const BackUpValues = {
                                                APPLY_SEQ: ApplySeq,
                                                SEQ: old.SEQ,
                                                REVERSE_FLAG: old.REVERSE_FLAG,
                                                SOURCE: old.SOURCE,
                                                DESTINATION: old.DESTINATION,
                                                SERVICE: old.SERVICE,
                                                T_SOURCE: old.T_SOURCE,
                                                T_DESTINATION: old.T_DESTINATION,
                                                EXPIRATION_DATE: old.EXPIRATION_DATE,
                                                DESCRIPTION: old.DESCRIPTION,
                                            };
                                            ApplyNatRuleBackUpRepository
                                                                .createQueryBuilder("BACKUP_RULE")
                                                                .insert()
                                                                .values(BackUpValues)
                                                                .execute().catch((err) => {
                                                                    console.log(err);
                                                                    updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE_BACKUP", err.sqlMessage);
                                                                });
                                        })
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", err.sqlMessage);
                                    });
                        }
                        

                        ApplyNatRuleRepository
                                    .createQueryBuilder("RULE")
                                    .insert()
                                    .values(ToInsert)
                                    .execute().catch((err) => {
                                        console.log(err);
                                        updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE", err.sqlMessage);
                                    });
                    }

                });            
                                                
        return {code: 200};
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY", "FAIL("+err.errno+") : "+err.code);
        return err;
    }
}

exports.editApplyAtWorkCancel = async (req, res) => {
    const ApplySeq = req.body.ApplySeq;
    const UserSeq = req.body.UserSeq;

    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyRuleRepository = getRepository(ApplyRuleEntity);
    const ApplyNatRuleRepository = getRepository(ApplyNatRuleEntity);
    const ApplyRuleBackUpRepository = getRepository(ApplyRuleBackUpEntity);
    const ApplyNatRuleBackUpRepository = getRepository(ApplyNatRuleBackUpEntity);

    // 수정에서 전부 DEL_YN Y로 바꾸고 수정한 거는 N으로 바꿈
    // 그래서 수정 취소에서 N 인거는 BACKUP에있는 건 수정, ADMIN_FLAG: 'N", CHANGE_ITMES: '', 없는 건 삭제
    // Y인거는 그냥 N으로 바꿈, 
    // ADMIN_MODIFY_FLAG: 'N',
    // ADMIN_TITLE: '',
    // APPLY_LAST_ACTION: "editApplyAtWork",
    // APPLY_ACTION_DATE: getCurrentDate("Y-m-d H:i:s")

    try{ 

        await createUserAction(UserSeq, "TBL_FW_APPLY", "editApplyAtWorkCancel", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    const ActionInsertId = res.raw.insertId;
                    // ApplyRepository
                    //         .createQueryBuilder("APPLY")
                    //         .update()
                    //         .set({
                    //             ADMIN_MODIFY_FLAG: 'N',
                    //             ADMIN_TITLE: '',
                    //             APPLY_LAST_ACTION: "editApplyAtWorkCancel",
                    //             APPLY_ACTION_DATE: getCurrentDate("Y-m-d H:i:s")
                    //         })
                    //         .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                    //         .execute().catch((err) => {
                    //             console.log(err);
                    //             updateUserAction(ActionInsertId, "TBL_FW_APPLY", err.sqlMessage);
                    //         });

                    //아님
                    // ApplyRuleRepository
                    //             .createQueryBuilder("RULE")
                    //             .update()
                    //             .set({
                    //                 DEL_YN: 'Y'
                    //             })
                    //             .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                    //             .execute().catch((err) => {
                    //                 console.log(err);
                    //                 updateUserAction(ActionInsertId, "TBL_FW_APPLY_RULE, NAT_RULE", err.sqlMessage);
                    //             });
                    
                    ApplyRuleBackUpRepository
                                .createQueryBuilder("RULE")
                                .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                                .getMany()
                                .then( (res) => {
                                    const BackRules = res;

                                     ApplyRuleRepository
                                                .createQueryBuilder("RULE")
                                                .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                                                .andWhere("DEL_YN='N'")
                                                .getMany()
                                                .then ( (res) => {
                                                    const CurrentRules = res;

                                                    console.log(BackRules);
                                                    console.log(CurrentRules);

                                                    const ToUpdateSeq = BackRules.reduce( (acc, rule) => {
                                                        acc.push(rule.SEQ);
                                                        return acc;
                                                    }, []);

                                                    const ToDeleteSeq = CurrentRules.filter( (rule) => !ToUpdateSeq.includes(rule.SEQ)).reduce( (acc, rule2) => { acc.push(rule2.SEQ); return acc;}, []);
                                                    
                                                    console.log("-----");
                                                    console.log(ToUpdateSeq);
                                                    console.log("-----");
                                                    console.log(ToDeleteSeq);
                                                    console.log("-----");
                                                })
                                });
                    
                    
                    
                    
                    

                    return 0;
                });            
                                                
        return {code: 200};
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY", "FAIL("+err.errno+") : "+err.code);
        return err;
    }
}

exports.retrieveSendMailData = async (apply) => {
    // const ApplySeq = apply.APPLY_SEQ;
    const ApplyStatus = apply.APPLY_STATUS;
    let UserDataForSendingMail = [];
    
    // const ApplyRepository = getRepository(ApplyEntity);
    const UserRepository = getRepository(UserEntity);

    try{ 
        if([1,2,3,5,6].includes(ApplyStatus)){
            if(ApplyStatus === 2 || ApplyStatus === 3){
                UserDataForSendingMail = apply.CONFIRMS.filter((confirm) => {
                    if(ApplyStatus == 1){
                        return (confirm.CONFIRM_FLAG == 1 && confirm.CONFIRM_ORDER == apply.APPLY_CONFIRM_ORDER) || confirm.CONFIRM_FLAG ==2;
                    }else{
                        // 3 이면
                        return (confirm.CONFIRM_FLAG == 1 && confirm.CONFIRM_ORDER == apply.APPLY_CONFIRM_ORDER);
                    }
                });
              
            }else if (ApplyStatus === 5 || ApplyStatus === 6){
                UserDataForSendingMail = apply.CONFIRMS.filter((confirm) => {
                    if(ApplyStatus == 5){
                        return (confirm.CONFIRM_FLAG == 3 && confirm.CONFIRM_ORDER == apply.RECEPTION_CONFIRM_ORDER) || confirm.CONFIRM_FLAG == 4;
                    }else{
                        // 6 이면
                        return (confirm.CONFIRM_FLAG == 3 && confirm.CONFIRM_ORDER == apply.RECEPTION_CONFIRM_ORDER);
                    }
                });
    
            }
            // console.log(UserDataForSendingMail);
    
            const ConfirmUserSeqs = UserDataForSendingMail.reduce((acc, confirm) => {
                acc.push(confirm.CONFIRM_USER_SEQ);
                return acc;
            }, [])
    
            const UserEmails =  await UserRepository
                                        .createQueryBuilder("USER")
                                        .select("USER.USER_EMAIL")
                                        .where(`USER_SEQ IN (:SEQ)`, {SEQ: ConfirmUserSeqs})
                                        .getMany();
            
            UserDataForSendingMail.forEach( (confirm, index) => {
                confirm.USER_EMAIL = UserEmails[index].USER_EMAIL;
            })
    
            // console.log(Confirms);
    
            return UserDataForSendingMail;
        }else if(ApplyStatus == 4 || ApplyStatus == 7){
            UserDataForSendingMail =  await UserRepository
                                                .createQueryBuilder("USER")
                                                .where("USER.USER_AUTH='Y'")
                                                .getMany();

            return UserDataForSendingMail;
        }else if (ApplyStatus == 8){
            UserDataForSendingMail =  await UserRepository
                                                .createQueryBuilder("USER")
                                                .where(`USER.USER_SEQ=${apply.USER_SEQ}`)
                                                .getMany();

            return UserDataForSendingMail;
        }

    }catch(err){
        console.log(err);
        return err;
    }

    // 모델에서 데이터 추출...
    // try{
        
    //     const ApplyQuery = ApplyRepository
    //                         .createQueryBuilder("APPLY")
    //                         .where(`APPLY.APPLY_SEQ=${ApplySeq}`);
        
    //     if(ApplyStatus === 2 || ApplyStatus === 3 || ApplyStatus === 5 || ApplyStatus === 6){
    //         let ConfirmFlag;
    //         let ConfirmOrderName;
    //         if(ApplyStatus === 2 || ApplyStatus === 3){
    //             // APPLY_CONFIRM_ORDER
    //             ConfirmFlag = 1;
    //             ConfirmOrderName = "APPLY_CONFIRM_ORDER";

    //             if(ApplyStatus === 2){
    //                 ApplyQuery
    //                     .innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `CONFIRM.APPLY_SEQ=${ApplySeq} AND ( (CONFIRM.CONFIRM_FLAG=${ConfirmFlag} AND CONFIRM.CONFIRM_ORDER=APPLY.${ConfirmOrderName}) OR ( CONFIRM.CONFIRM_FLAG = 2 ) )`);
    //             }else{
    //                 ApplyQuery
    //                     .innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `CONFIRM.APPLY_SEQ=${ApplySeq} AND CONFIRM.CONFIRM_FLAG=${ConfirmFlag} AND CONFIRM.CONFIRM_ORDER=APPLY.${ConfirmOrderName}`);
    //             }

    //         }else if (ApplyStatus === 5 || ApplyStatus === 6){
    //             // RECEPTION_CONFIRM_ORDER
    //             ConfirmFlag = 3;
    //             ConfirmOrderName = "RECEPTION_CONFIRM_ORDER";

    //             if(ApplyStatus === 5){
    //                 ApplyQuery
    //                     .innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `CONFIRM.APPLY_SEQ=${ApplySeq} AND ( (CONFIRM.CONFIRM_FLAG=${ConfirmFlag} AND CONFIRM.CONFIRM_ORDER=APPLY.${ConfirmOrderName}) OR ( CONFIRM.CONFIRM_FLAG = 4 ) )`);
    //             }else{
    //                 ApplyQuery
    //                     .innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `CONFIRM.APPLY_SEQ=${ApplySeq} AND CONFIRM.CONFIRM_FLAG=${ConfirmFlag} AND CONFIRM.CONFIRM_ORDER=APPLY.${ConfirmOrderName}`);
    //             }
    //         }

    //         // ApplyQuery.innerJoinAndSelect("APPLY.CONFIRMS", "CONFIRM", `CONFIRM.APPLY_SEQ=${ApplySeq} AND CONFIRM.CONFIRM_FLAG=${ConfirmFlag} AND CONFIRM.CONFIRM_ORDER=APPLY.${ConfirmOrderName}`);
    //         const ApplyInfo = await ApplyQuery.getOne();
    //         const Confirms = ApplyInfo.CONFIRMS;
    //         const ConfirmUserSeqs = Confirms.reduce((acc, confirm) => {
    //             acc.push(confirm.CONFIRM_USER_SEQ);
    //             return acc;
    //         }, [])

    //         const UserEmails =  await UserRepository
    //                                     .createQueryBuilder("USER")
    //                                     .select("USER.USER_EMAIL")
    //                                     .where(`USER_SEQ IN (:SEQ)`, {SEQ: ConfirmUserSeqs})
    //                                     .getMany();
            
    //         Confirms.forEach( (confirm, index) => {
    //             confirm.USER_EMAIL = UserEmails[index].USER_EMAIL;
    //         })

    //         // console.log(Confirms);

    //         return Confirms;
    //     }else if (ApplyStatus == 4 || ApplyStatus == 7){
    //         const UserEmails =  await UserRepository
    //                                     .createQueryBuilder("USER")
    //                                     .select("USER.USER_EMAIL")
    //                                     .where("USER_AUTH = 'Y'")
    //                                     .getMany();
    //         const ManagerEmailInfo = [];

    //         Confirms.forEach( (user_info,) => {
    //             ret.push(user_info.USER_EMAIL);
    //         });

    //         return ManagerEmailInfo;

    //     }else if (ApplyStatus == 8){


    //     }


    // }catch(err){
    //     console.log(err);
    //     return err;
    // }
}

/**
 * 
 * @param {int} 2, 5: 결재 메일, 3, 6: 참조 메일, 4, 7: 결재 완료 메일, 8: 작업 완료 메일 
 * @returns 
 */
exports.getMailForm = async (flag) => {
    const Flag = flag;
    const MailFormRepository = getRepository(MailFormEntity);
    let result;
    try{ 
        if(Flag == 2){
            result = await MailFormRepository
                                .createQueryBuilder("MAIL_FORM")
                                .where("seq = :seq", {seq : 1})
                                .getOne();
        }else if(Flag == 3){
            result = await MailFormRepository
                                .createQueryBuilder("MAIL_FORM")
                                .where("seq = :seq", {seq : 2})
                                .getOne();
        }else if(Flag == 4){
            result = await MailFormRepository
                                .createQueryBuilder("MAIL_FORM")
                                .where("seq = :seq", {seq : 3})
                                .getOne();
        }else if(Flag == 5){
            result = await MailFormRepository
                                .createQueryBuilder("MAIL_FORM")
                                .where("seq = :seq", {seq : 1})
                                .getOne();
        }else if(Flag == 6){
            result = await MailFormRepository
                                .createQueryBuilder("MAIL_FORM")
                                .where("seq = :seq", {seq : 2})
                                .getOne();
        }else if(Flag == 7){
            result = await MailFormRepository
                                .createQueryBuilder("MAIL_FORM")
                                .where("seq = :seq", {seq : 3})
                                .getOne();
        }else if(Flag == 8){
            result = await MailFormRepository
                                .createQueryBuilder("MAIL_FORM")
                                .where("seq = :seq", {seq : 4})
                                .getOne();
        }

        return result;

    }catch(err){
        console.log(err);
        return err;
    }
}

exports.confirmApprove = async (req, res) => {
    const ConfirmSeq = req.body.CONFIRM_SEQ;
    const ConfirmMemo = req.body.CONFIRM_MEMO;
    const ConfirmFlag = req.body.CONFIRM_FLAG;
    const ConfirmOrder = req.body.CONFIRM_ORDER;
    const ApplySeq = req.body.APPLY_SEQ;
    const ApplyConfirmCount = req.body.APPLY_CONFIRM_COUNT;
    const UserSeq = req.body.UserSeq;
    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyConfirmRepository = getRepository(ApplyConfirmEntity);

    let ApplyUpdateData = {
        "APPLY_LAST_ACTION": "confirmApprove confirmFlag : "+ConfirmFlag,
        "APPLY_ACTION_DATE": getCurrentDate("Y-m-d H:i:s")
    }

    if(ConfirmFlag === 1){
        if(ApplyConfirmCount == ConfirmOrder){
            ApplyUpdateData.APPLY_STATUS = 4;
            ApplyUpdateData.APPLY_CONFIRM_ORDER = 6;
        }else{
            ApplyUpdateData.APPLY_STATUS = 3;
            ApplyUpdateData.APPLY_CONFIRM_ORDER = ConfirmOrder+1;
        }
        
    }else if(ConfirmFlag === 3){
        console.log(ConfirmOrder);
        console.log(ApplyConfirmCount);
        ApplyUpdateData.APPLY_STATUS = 6
        if(ApplyConfirmCount === ConfirmOrder){
            ApplyUpdateData.APPLY_RECEPT_FLAG = "Y"
            ApplyUpdateData.RECEPTION_CONFIRM_ORDER = 6;
        }else{
            ApplyUpdateData.APPLY_RECEPT_FLAG = "P"
            ApplyUpdateData.RECEPTION_CONFIRM_ORDER = ConfirmOrder+1;
        }
    }

    try{ 

        // const ActionInsertId = createUserAction(UserSeq, "TBL_FW_APPLY_CONFIRM", "confirmApply", "SUCCESS");
        let ActionInsertId;
        await createUserAction(UserSeq, "TBL_FW_APPLY", "confirmApply", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    ActionInsertId = res.raw.insertId;
                });

        const Result = await ApplyConfirmRepository
                                            .createQueryBuilder("APPLY_CONFIRM")
                                            .update()
                                            .set({
                                                CONFIRM_STATUS: "C",
                                                CONFIRM_MEMO: ConfirmMemo,
                                                CONFIRM_DATE: getCurrentDate("Y-m-d H:i:s")
                                            })
                                            .where("CONFIRM_SEQ = :CONFIRM_SEQ", {CONFIRM_SEQ: ConfirmSeq})
                                            .execute().catch((err) => {
                                                console.log(err);
                                                updateUserAction(ActionInsertId, "TBL_FW_APPLY_CONFIRM", err.sqlMessage);
                                            });
            
        await ApplyRepository
                        .createQueryBuilder("APPLY")
                        .update()
                        .set(ApplyUpdateData)
                        .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                        .execute().catch((err) => {
                            console.log(err);
                            updateUserAction(ActionInsertId, "TBL_FW_APPLY", err.sqlMessage);
                        });


        return Result;
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY_CONFIRM", "FAIL("+err.errno+") : "+err.code);
        return err;
    }
}

exports.confirmReject = async (req, res) => {
    const ConfirmSeq = req.body.CONFIRM_SEQ;
    const ConfirmMemo = req.body.CONFIRM_MEMO;
    const ConfirmFlag = req.body.CONFIRM_FLAG;
    // const ConfirmOrder = req.body.CONFIRM_ORDER;
    const ApplySeq = req.body.APPLY_SEQ;
    const UserSeq = req.body.UserSeq;
    const ApplyRepository = getRepository(ApplyEntity);
    const ApplyConfirmRepository = getRepository(ApplyConfirmEntity);

    let ApplyUpdateData = {
        "APPLY_LAST_ACTION": "confirmReject confirmFlag : "+ConfirmFlag,
        "APPLY_ACTION_DATE": getCurrentDate("Y-m-d H:i:s")
    }

    if(ConfirmFlag === 1){
        ApplyUpdateData.APPLY_STATUS = -1
        // ApplyUpdateData.APPLY_CONFIRM_ORDER = ConfirmOrder+1;
    }else if(ConfirmFlag === 3){
        ApplyUpdateData.APPLY_STATUS = -2
        ApplyUpdateData.APPLY_RECEPT_FLAG = "Z"
        // ApplyUpdateData.RECEPTION_CONFIRM_ORDER = ConfirmOrder+1;
    }

    try{ 

        // const ActionInsertId = createUserAction(UserSeq, "TBL_FW_APPLY_CONFIRM", "confirmReject", "SUCCESS");
        let ActionInsertId;
        await createUserAction(UserSeq, "TBL_FW_APPLY", "confirmReject", "SUCCESS")
                .then((res) =>{
                    console.log(res);
                    console.log(res.raw.insertId);
                    ActionInsertId = res.raw.insertId;
                });

        const Result = await ApplyConfirmRepository
                                            .createQueryBuilder("APPLY_CONFIRM")
                                            .update()
                                            .set({
                                                CONFIRM_STATUS: "R",
                                                CONFIRM_MEMO: ConfirmMemo,
                                                CONFIRM_DATE: getCurrentDate("Y-m-d H:i:s")
                                            })
                                            .where("CONFIRM_SEQ = :CONFIRM_SEQ", {CONFIRM_SEQ: ConfirmSeq})
                                            .execute().catch((err) => {
                                                console.log(err);
                                                updateUserAction(ActionInsertId, "TBL_FW_APPLY_CONFIRM", err.sqlMessage);
                                            });

        await ApplyRepository
                        .createQueryBuilder("APPLY")
                        .update()
                        .set(ApplyUpdateData)
                        .where("APPLY_SEQ = :APPLY_SEQ", {APPLY_SEQ: ApplySeq})
                        .execute().catch((err) => {
                            console.log(err);
                            updateUserAction(ActionInsertId, "TBL_FW_APPLY", err.sqlMessage);
                        });
        
        return Result;
    }catch(err){
        updateUserAction(ActionInsertId, "TBL_FW_APPLY_CONFIRM", "FAIL("+err.errno+") : "+err.code);
        return err;
    }
}

/**
 * 
 * @param {Int} seq 파일 SEQ
 * @returns 
 */
exports.getApplyAttach = async (req, res) => {
    const AttachSeq = req.params.id;
    const ApplyAttachRepository = getRepository(ApplyAttachEntity);

    try{
        const Attach = ApplyAttachRepository
                                        .createQueryBuilder("ATTACH")
                                        .where(`ATTACH.SEQ=${AttachSeq}`)
                                        .getOne();
                                        
        return Attach;
    }catch(err){
        console.log(err);
    }                          
}

/**
 * 신청서 라스트 액션 추가
 * @param {Object} apply 
 * @param {String} description 
 * @param {Datetime} date 
 * @returns 
 */
function addLastAction(apply, description, date){
    apply.APPLY_LAST_ACTION = description;
    apply.APPLY_ACTION_DATE = date;
    
    return apply;
}
/**
 * 유저 로그 저장
 * @param {int} userSeq 
 * @param {String} tableName 
 * @param {String} functionName 
 * @param {String} result 
 * @returns insertId
 */
 async function createUserAction(userSeq, tableName, functionName, result){
    
    const UserActionRepository = getRepository(UserActionEntity);
    const UserAction = {
        USER_SEQ: userSeq,
        USER_ACTION_TABLE: tableName,
        USER_ACTION_FUNCTION: functionName,
        USER_ACTION_RESULT: result,
        USER_ACTION_DATE: getCurrentDate("Y-m-d H:i:s"),
    }
    const UserActionQuery = UserActionRepository
                                .createQueryBuilder("USER_ACTION")
                                .insert()
                                .values([UserAction])
                                .execute().catch((err) => {
                                    console.log(err);
                                });
    return UserActionQuery;
    
    
}

/**
 * 유저 로그 성공, 실패에 따른 결과 업데이트
 * @param {int} actionId 
 * @param {String} result 
 * @returns result
 */
function updateUserAction(actionId, tableName, result){
    console.log(actionId);
    console.log(result);
    const UserActionRepository = getRepository(UserActionEntity);

    const Result = UserActionRepository
                                .createQueryBuilder("USER_ACTION")
                                .update()
                                .set({
                                    USER_ACTION_TABLE: tableName,
                                    USER_ACTION_RESULT: result
                                })
                                .where("SEQ = :SEQ", {SEQ: actionId})
                                .execute().catch((err) => {
                                    console.log(err);
                                });
    return Result;
}



