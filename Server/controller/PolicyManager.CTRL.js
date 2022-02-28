const PolicyManagerModel = require('../models/policyManagerModel');
const UserModel = require("../models/userModel");
const CompanyModel = require("../models/companyModel");
const Common = require("../lib/common");

const getNode = async(req, res) =>{
    const nodeSeq = req.body.nodeSeq;
    const result = await PolicyManagerModel.getNode(nodeSeq);
    res.json(result)
}

const getAllNode = async(req, res) =>{
    const result = await PolicyManagerModel.getAllNode(req, res);
    res.json(result);
}

const getRootNode = async(req, res) =>{
    const result = await PolicyManagerModel.getRootNode(req, res);
    res.json(result);
}

const getChildNode = async(req, res) =>{
    const result = await PolicyManagerModel.getChildNode(req, res);
    res.json(result);
}

const deleteNode = async(req, res) =>{
    const nodeSeq = req.body.nodeSeq;
    const result = await PolicyManagerModel.deleteNode(nodeSeq);
    res.json(result);
}

const saveNode = async(req, res) => {
    let returnMsg, result;
    const parentSeq = req.body.seq;
    const type = req.body.nodeType;
    const answerFlag = req.body.question;
    const adminMemo = req.body.adminComment;
    const userMemo = req.body.userComment;
    const filter = req.body.filter;

    let checkOverlap = await PolicyManagerModel.checkOverlapNode(parentSeq, answerFlag)
    if(checkOverlap){
        returnMsg = {
            code: 201,
            msg: "해당 항목이 이미 존재합니다."
        }
    } else {
        const now = new Date();
        const data = {
            P_SEQ: parentSeq,
            TYPE: type,
            ANSWER_FLAG: answerFlag,
            ADMIN_MEMO: adminMemo,
            USER_MEMO: userMemo,
            REG_DATE: now,
            DEL_YN: 'N'
        }   
        
        result = await PolicyManagerModel.saveNode(data);
        if(result){
            let promises = filter.map(async element => {
                let data = {
                    N_SEQ: result.raw.insertId,
                    FILTER_TYPE: element.type,
                    FILTER_GROUP_CONDITION: element.condition,
                    FILTER_CONDITION: "",
                    FILTER_CONTENTS: JSON.stringify(element.items),
                    FILTER_DEL_YN: "N"
                }
                await PolicyManagerModel.insertFilter(data);
            })
            await Promise.all(promises);
            returnMsg = {
                code: 200,
                msg: "정상적으로 등록되었습니다."
            }
        }else {
            returnMsg = {
                code: 201,
                msg: "등록 실패"
            }
        }
        
    }

    res.json(returnMsg);
}

const modifyNode = async(req, res) => {
    let returnMsg, result;
    const nodeSeq = req.body.seq;
    const type = req.body.nodeType;
    // const answerFlag = req.body.question;
    const adminMemo = req.body.adminComment;
    const userMemo = req.body.userComment;
    const filter = req.body.filter;

    const data = {
        TYPE: type,
        ADMIN_MEMO: adminMemo,
        USER_MEMO: userMemo
    }
        
    result = await PolicyManagerModel.modifyNode(nodeSeq, data);
    if(result){
        // 기존 값 삭제 후 재생성
        await PolicyManagerModel.deleteFilters(nodeSeq)
        let promises = filter.map(async element => {
            let data = {
                N_SEQ: nodeSeq,
                FILTER_TYPE: element.type,
                FILTER_GROUP_CONDITION: element.condition,
                FILTER_CONDITION: "",
                FILTER_CONTENTS: JSON.stringify(element.items),
                FILTER_DEL_YN: "N"
            }
            await PolicyManagerModel.insertFilter(data);
        })
        await Promise.all(promises);
        returnMsg = {
            code: 200,
            msg: "수정 완료"
        }
    }else {
        returnMsg = {
            code: 201,
            msg: "등록 실패"
        }
    }

    res.json(returnMsg);
}

const filterSearch = async(req, res) => {
    let result;
    const type = req.body.type;
    switch(type){
        case "source":
            break;
        case "destination":
            break;
        case "service":
            break;
        case "usr":
            result = await UserModel.searchUser(req, res);
            break;
        case "deptm":
            result = await CompanyModel.getDepartList(req, res);
            break;
    }
    
    res.json(result);
}

const exportFlowChart = async(req, res) => {
    const result = await PolicyManagerModel.getAllNode(req, res);
    const json = JSON.stringify(result);
    const encryped = Common.encrypt(json);
    res.json(encryped);
}

const importFlowChart = async(req, res) => {
    let returnMsg;
    const encryptFile = req.body.encryptFile;
    const decrypted = await Common.decrypt(encryptFile);
    if(!decrypted){
        returnMsg = {
            code: 202,
            msg: "정상적으로 백업된 파일이 아닙니다. 파일을 확인해주세요."
        }
        res.json(returnMsg);
        return false;
    }

    const json = JSON.parse(decrypted);

    await PolicyManagerModel.deleteFlowChart();
    let promises = json.map(async element => {
        await PolicyManagerModel.saveNode(element);
        if(element.FILTER_INFO){
            let promises2 = element.FILTER_INFO.map(async filterItem => {
                await PolicyManagerModel.insertFilter(filterItem);
            })
            await Promise.all(promises2);
        }
    })
    await Promise.all(promises);

    if(json.length > 0){
        returnMsg = {
            code: 200,
            msg: "등록되었습니다."
        }
    } else {
        returnMsg = {
            code: 201,
            msg: "등록되지 않았습니다."
        }
    }
    res.json(returnMsg);
}


// 함수 이전으로 전달 
module.exports = {
    getNode,
    getAllNode,
    getRootNode,
    getChildNode,
    deleteNode,
    saveNode,
    filterSearch,
    modifyNode,
    exportFlowChart,
    importFlowChart
}; 