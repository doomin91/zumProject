"use strict"
const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");

const CompanyModel = require('../models/companyModel');
const ApplyModel = require('../models/applyModel');
const SettingModel = require('../models/settingModel');

const getTakeOver = async(req, res) =>{
    return await SettingModel.getTakeOver(req, res);
}

const getTakeOverOne = async(req, res) =>{
    let TakeOver = await SettingModel.getTakeOverOne(req, res);
    const ApplySeq = JSON.parse(TakeOver.APPLY_SEQ);
    let array = [];
    let promises = ApplySeq.map( async (element) =>{
        let Apply = await ApplyModel.getApplyFromSeq(element);
        array.push(Apply);
    });
    await Promise.all(promises);
    TakeOver.APPLY = array;
    return res.json(TakeOver);
}

const getPolicyAdminList = async(req, res) =>{
    return await SettingModel.getPolicyAdminList(req, res);
}

const insertPolicyAdmin = async(req, res) =>{
    const admin = req.body.admin;
    const limit = req.body.limit;
    const date = req.body.date;
    console.log(date);
    let resultArray = []

    let promises = admin.map( async (element) => {
        let data = {
            ADMIN_SEQ : element.USER_SEQ,
            LIMIT_SEQ : limit,
            START_DATE : date[0],
            END_DATE : date[1]
        }
        resultArray.push(await SettingModel.insertPolicyAdmin(data));
    })
    /* 병렬처리를 진행하지만 전체 PROCESS를 기다림 */
    await Promise.all(promises);

    res.json(resultArray);
}

const deletePolicyAdmin = async(req, res) =>{
    return await SettingModel.deletePolicyAdmin(req, res);
}

const updatePolicyAdmin = async(req, res) =>{
    return res;
}

const getPolicyLimits = async(req, res) =>{
    return await SettingModel.getPolicyLimits(req, res);
}
const insertPolicyLimit = async(req, res) =>{
    return await SettingModel.insertPolicyLimit(req, res);
}
const updatePolicyLimit = async(req, res) =>{
    const limitSeq =  req.body.limitSeq;
    const data = {
        LIMIT_TITLE: req.body.limitTitle,
        LIMIT_DEFAULT_FLAG:req.body.defaultLimit,
        LIMIT_APPLY:req.body.defultNum,
        LIMIT_APPLY_RULE:req.body.applyNum,
        LIMIT_RULE:req.body.accountNum,
        LIMIT_PERIOD_FLAG:req.body.limitPeriod
    }
    return await SettingModel.updatePolicyLimit(data, limitSeq, res);
}
const deletePolicyLimit = async(req, res) =>{
    return await SettingModel.deletePolicyLimit(req, res);
}

const getDeviceList = async(req, res) =>{
    return await SettingModel.getDeviceList(req, res);
}

const getSmtpInfo = async(req, res) =>{
    let result = await SettingModel.getSmtpInfo(req, res);
    res.json(result);
}

const insertSmtpInfo = async(req, res) =>{
    return await SettingModel.insertSmtpInfo(req, res);
}

const updateSmtpInfo = async(req, res) =>{
    return await SettingModel.updateSmtpInfo(req, res);
}

const saveSmtpSetting = async(req, res) =>{
    console.log(req.body);
    let smtpData = {
        SMTP_USER_FLAG : req.body.enable,
        SMTP_AUTH_FLAG: req.body.authenticate,
        SMTP_TLS_FLAG: req.body.tls,
        SMTP_HOST: req.body.host,
        SMTP_PORT: req.body.port,
        SMTP_USER: req.body.user,
        SMTP_PASS: req.body.password,
        SMTP_PROTOCOL: req.body.protocol,
        SMTP_MAIL_ADDR: req.body.receiver
    }

    console.log(smtpData);
    let result = "";
    const isThereSetting = await SettingModel.getSmtpInfo();    
    if(!isThereSetting){
        console.log("insert");
        result = await SettingModel.insertSmtpInfo(smtpData);
    }else {
        console.log("update");
        result = await SettingModel.updateSmtpInfo(isThereSetting.SEQ, smtpData);
    }
    
    res.json(result);
}

const sendTestEmail = async(req, res) =>{
    // let testAccount = await nodemailer.createTransport();
    try {
        console.log(req.body);

    let transporter = await nodemailer.createTransport({
        host: req.body.host,   
        port: 465,
        secure: req.body.authenticate,
        auth : {
            user: req.body.user,
            pass: req.body.password
        },
        tls: {
            secure: req.body.tls,
            ignoreTLS: true,
            rejectUnauthorized: true
        }
    });

    let info = await transporter.sendMail({
        from: req.body.user,
        to: req.body.receiver,
        subject: "[WITHFLOW] SMTP TEST MAIL",
        text : "해당 메일은 WITHFLOW에서 전송된 메일입니다.",
        html : "<b>html 테스트</b><table><Tr><Td>1</td><td>2</td></tr></table>"
    })

    res.json(info);
    }
    catch (error) {
        res.json(error);
    }
}

const sendMail = async(req, res) =>{
        const Apply = req.body.apply_info;
        const ApplyStatus = Apply.APPLY_STATUS;
    try {     
        const SendingMailInfo = await ApplyModel.retrieveSendMailData(Apply);

        console.log("------------------------- ");
        console.log(SendingMailInfo);
        console.log("------------------------- ");

        let Confirm = [];
        let ConfirmEmails = "";
        let Cc = [];
        let CcEmails = "";

        if([1,2,3,5,6].includes(ApplyStatus)){
            Confirm.push(SendingMailInfo[0]);
            ConfirmEmails = SendingMailInfo[0].USER_EMAIL;
            if(SendingMailInfo.length > 1){
                Cc = SendingMailInfo.filter( (val, index) => index != 0);
                CcEmails = Cc.reduce( (acc, confirm, idx) =>{
                    console.log(acc);
                    if(idx == 0){
                        acc += confirm.USER_EMAIL;
                    }else{
                        acc += ","+confirm.USER_EMAIL;
                    }
                    return acc;
                }, "");
            }
        }

        console.log("------------------------- ");
        console.log(Confirm);
        console.log(ConfirmEmails);
        console.log(Cc);
        console.log(CcEmails);
        console.log("------------------------- ");

        let transporter = await nodemailer.createTransport({
            host: req.body.host,   
            port: 465,
            secure: req.body.authenticate,
            auth : {
                user: req.body.user,
                pass: req.body.password
            },
            tls: {
                secure: req.body.tls,
                ignoreTLS: true,
                rejectUnauthorized: true
            }
        });

        let MailForm = ""
        let MailForm2 = "";
        const UserName = Apply.APPLY_USER_NAME;
        const UserPosition = Apply.APPLY_USER_POSITION;
        const ApplyNumber = Apply.APPLY_NUMBER;
        const ApplyRegDate = Apply.APPLY_REG_DATE;
        const ApplyTile = Apply.APPLY_TITLE;
        
        const ApplyRules = Apply.RULES ? Apply.RULES : [];
        const ApplyNatRules = Apply.NAT_RULES ? Apply.NAT_RULES : [];

        MailForm = await ApplyModel.getMailForm(ApplyStatus);
        MailForm = MailForm.MAIL_CONTENTS;

        MailForm = MailForm.replace("***USER_NAME***", UserName);
        MailForm = MailForm.replace("***USER_POSITION***", UserPosition);
        MailForm = MailForm.replace("***APPLY_NUMBER***", ApplyNumber);
        MailForm = MailForm.replace("***APPLY_REG_DATE***", ApplyRegDate);
        MailForm = MailForm.replace("***APPLY_TITLE***", ApplyTile);

        if((ApplyStatus == 2 || ApplyStatus == 5) && Cc.length > 0){
            MailForm2 = await ApplyModel.getMailForm(ApplyStatus+1);
            MailForm2 = MailForm2.MAIL_CONTENTS;

            MailForm2 = MailForm.replace("***USER_NAME***", UserName);
            MailForm2 = MailForm.replace("***USER_POSITION***", UserPosition);
            MailForm2 = MailForm.replace("***APPLY_NUMBER***", ApplyNumber);
            MailForm2 = MailForm.replace("***APPLY_REG_DATE***", ApplyRegDate);
            MailForm2 = MailForm.replace("***APPLY_TITLE***", ApplyTile);
        }

        let Row = "";
        ApplyRules.forEach( (rule, index) => {
            let ReverseFlag = rule.REVERSE_FLAG == 1 ? "checked" : "";
            
            Row += "<tr>"+
                    "<td>"+
                        `<input type='checkbox' ${ReverseFlag}`+
                    "</td>"+
                    "<td>"+
                        rule.SOURCE.replaceAll(',', "<br>")+
                    "</td>"+
                    "<td>"+
                        rule.DESTINATION.replaceAll(',', "<br>")+
                    "</td>"+
                    "<td>"+
                        rule.SERVICE.replaceAll(',', "<br>")+
                    "</td>"+
                    "<td>"+
                        rule.EXPIRATION_DATE+
                    "</td>"+
                    "<td>"+
                        rule.DESCRIPTION.replaceAll('\n', "<br>")+
                    "</td>"+
                    "</tr>";
        });
        MailForm = MailForm.replace("***RULE_LIST***", Row);
        if((ApplyStatus == 2 || ApplyStatus == 5) && Cc.length > 0){
            MailForm2 = MailForm2.replace("***RULE_LIST***", Row);
        }

        Row = "";
        ApplyNatRules.forEach( (rule, index) => {
            let ReverseFlag = rule.REVERSE_FLAG == 1 ? "checked" : "";
            
            Row += "<tr>"+
                    "<td>"+
                        `<input type='checkbox' ${ReverseFlag}`+
                    "</td>"+
                    "<td>"+
                        rule.SOURCE.replaceAll(',', "<br>")+
                    "</td>"+
                    "<td>"+
                        rule.DESTINATION.replaceAll(',', "<br>")+
                    "</td>"+
                    "<td>"+
                        rule.SERVICE.replaceAll(',', "<br>")+
                    "</td>"+
                    "<td>"+
                        rule.T_SOURCE.replaceAll(',', "<br>")+
                    "</td>"+
                    "<td>"+
                        rule.T_DESTINATION.replaceAll(',', "<br>")+
                    "</td>"+
                    "<td>"+
                        rule.EXPIRATION_DATE+
                    "</td>"+
                    "<td>"+
                        rule.DESCRIPTION.replaceAll('\n', "<br>")+
                    "</td>"+
                    "</tr>";
        });
        MailForm = MailForm.replace("***RULE_LIST***", Row);
        if((ApplyStatus == 2 || ApplyStatus == 5) && Cc.length > 0){
            MailForm2 = MailForm2.replace("***RULE_LIST***", Row);
        }

        console.log(MailForm);
        console.log(MailForm2);

        let Result;
        if(ApplyStatus == 2 || ApplyStatus == 5){
            if(CcEmails !== ""){
                Result = await Promise
                                    .all([
                                        transporter.sendMail({
                                            from: req.body.user,
                                            to: ConfirmEmails,
                                            subject: "[WITHFLOW] 결재 승인 요청",
                                            // text : "해당 메일은 WITHFLOW에서 전송된 메일입니다.",
                                            html : MailForm
                                        }),
                                        transporter.sendMail({
                                            from: req.body.user,
                                            to: CcEmails,
                                            subject: "[WITHFLOW] 결재 참조",
                                            // text : "해당 메일은 WITHFLOW에서 전송된 메일입니다.",
                                            html : MailForm2
                                        }),
                                    ])
                                    .catch((err)=> {
                                        console.log(err);
                                    });
            }else{
                Result = await transporter
                                .sendMail({
                                    from: req.body.user,
                                    to: ConfirmEmails,
                                    subject: "[WITHFLOW] 결재 승인 요청",
                                    // text : "해당 메일은 WITHFLOW에서 전송된 메일입니다.",
                                    html : MailForm
                                })
            }
           
        }else{
            let Subject = "";
            if(ApplyStatus == 4){
                Subject = "[WITHFLOW] 결재 완료";
            }else if (ApplyStatus == 7){
                Subject = "[WITHFLOW] 작업 결재 완료";
            }else if (ApplyStatus == 7){
                Subject = "[WITHFLOW] 작업 완료";
            }
            Result = await transporter
                                .sendMail({
                                    from: req.body.user,
                                    to: ConfirmEmails,
                                    subject: Subject,
                                    // text : "해당 메일은 WITHFLOW에서 전송된 메일입니다.",
                                    html : MailForm
                                })
        }

        res.json(Result);
    }
    catch (error) {
        console.log(error);
        res.json(error);
    }
}

const getMailForm = async(req, res) => {
    return await SettingModel.getMailForm(req, res);
}

const getMailFormList = async(req, res) =>{
    return await SettingModel.getMailFormList(req, res);
}

const updateMailForm = async(req, res) => {
    const mailFormSeq = req.body.seq;
    const data = {
        MAIL_CONTENTS : req.body.contents
    }
    const result = await SettingModel.updateMailForm(mailFormSeq, data);
    res.json(result);
}

const getConfirmLineList = async(req, res) => {
    return await SettingModel.getConfirmLineList(req, res);
}

const newConfirmLine = async(req, res) => {
    let data = {
        USER_SEQ: req.body.userSeq,
        LINE_TITLE: req.body.confirmTitle,
        CONFIRM_LINE_DATA: JSON.stringify(req.body.confirmLineData)
    }
    const result = await SettingModel.newConfirmLine(data);

    res.json(result);
}

const deleteConfirmLine = async(req, res) => {
    return await SettingModel.deleteConfirmLine(req, res);
}

const moveApplies = async(req, res) => {
    let today = new Date();
    let data = {
        FROM_USER_SEQ: req.body.fromUser,
        TO_USER_SEQ: req.body.toUser,
        APPLY_SEQ: JSON.stringify(req.body.selection),
        REG_DATE: today,
        APPROVAL_FLAG: 'N',
        DEL_YN: 'N',
    };
    const result = await SettingModel.moveApplies(data);
    res.json(result)
}

const approvalTakeOver = async(req, res) => {
    const apply = await SettingModel.getTakeOverOne(req, res);
    console.log(apply);
    const apply_json = JSON.parse(apply.APPLY_SEQ);

    let promises = apply_json.map(async element => {
        let updateTakeOver = await SettingModel.takeOverProcess(element, apply.TO)
        
        /**
         *  이관신청 로그 남기기
         */
        if(updateTakeOver){
            let now = new Date();
            let logData = {
                APPLY_SEQ : element,
                FROM_USER_SEQ : apply.FROM_USER_SEQ,
                TO_USER_SEQ : apply.TO_USER_SEQ,
                REG_DATE : now
            }
            await SettingModel.insertTakeOverLog(logData);
        }
    })
    await Promise.all(promises);

    const now = new Date()
    const data = {
        APPROVAL_FLAG: 'Y',
        APPROVAL_DATE: now 
    }
    let result = SettingModel.updateTakeOver(apply.SEQ, data);
    
    if(result){
        result = {
            code:200,
            msg:"성공"
        }
    } else {
        result = {
            code:201,
            msg:"실패"
        }
    }

    res.json(result);
    // return await SettingModel.approvalTakeOver(req, res);
}

// 함수 이전으로 전달 
module.exports = {
    getTakeOver,
    getTakeOverOne,
    getPolicyAdminList,
    insertPolicyAdmin,
    deletePolicyAdmin,
    updatePolicyAdmin,
    getPolicyLimits,
    insertPolicyLimit,
    updatePolicyLimit,
    deletePolicyLimit,
    getDeviceList,
    getSmtpInfo,
    insertSmtpInfo,
    updateSmtpInfo,
    saveSmtpSetting,
    sendTestEmail,
    sendMail,
    getMailForm,
    getMailFormList,
    updateMailForm,
    getConfirmLineList,
    newConfirmLine,
    deleteConfirmLine,
    moveApplies,
    approvalTakeOver
}; 
