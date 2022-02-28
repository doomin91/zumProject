"use strict";
const express = require("express");
const router = express();

const user_ctrl = require("./User.CTRL");
    router.post("/api/getUserList"            , user_ctrl.getUserList);
    router.get("/api/getUser"                 , user_ctrl.getUser);
    router.post("/api/deleteUser"             , user_ctrl.deleteUser);
    router.post("/api/modifyUser"             , user_ctrl.updateUserInfo);
    router.post("/api/registUser"             , user_ctrl.createUserInfo);
    router.post("/api/searchUserList"         , user_ctrl.searchUserList);
    router.post("/api/getAdminList"           , user_ctrl.getAdminList);
    router.post("/api/modifyAuth"             , user_ctrl.modifyAuth);
    router.post("/api/searchAdmin"            , user_ctrl.searchAdmin);

const apply_ctrl = require("./Apply.CTRL");
    router.get("/api/checkApplyInWriting/:userId"                   , apply_ctrl.checkApplyInWriting);
    router.put("/api/deleteApplyInWriting"                          , apply_ctrl.deleteApplyInWriting);
    router.get("/api/getApply/:id"                                  , apply_ctrl.getApply);
    router.get("/api/getApplyStatus/:id"                            , apply_ctrl.getApplyStatus);
    router.get("/api/getApplies/:flag/user/:userId/:userAuth"       , apply_ctrl.getApplies);
    router.get("/api/getMyApplies/:userId"                          , apply_ctrl.getMyApplies);
    router.get("/api/getApplyCopyData/:id"                          , apply_ctrl.getApplyCopyData);
    router.get("/api/checkCopyData/:id"                             , apply_ctrl.checkCopyData);
    router.get("/api/getCurrentUserInfo/:userId"                    , apply_ctrl.getCurrentUserInfo);
    router.get("/api/getLatestConfirmLine/:flag/user/:userId"       , apply_ctrl.getLatestConfirmLine);
    router.post("/api/saveAppForm"                                  , apply_ctrl.saveAppForm);
    router.post("/api/editAppForm"                                  , apply_ctrl.editAppForm);
    router.post("/api/saveAppForm2"                                 , apply_ctrl.saveAppForm2);
    router.post("/api/editAppForm2"                                 , apply_ctrl.editAppForm2);
    router.post("/api/checkFileSignatureAndParse"                   , apply_ctrl.checkFileSignatureAndParse);
    router.put("/api/saveApply"                                     , apply_ctrl.saveApply);
    router.post("/api/applyWork"                                    , apply_ctrl.applyWork);
    router.post("/api/editApplyAtWork"                              , apply_ctrl.editApplyAtWork);
    router.post("/api/editApplyAtWorkCancel"                        , apply_ctrl.editApplyAtWorkCancel);
    router.put("/api/confirmApprove"                                , apply_ctrl.confirmApprove);
    router.put("/api/confirmReject"                                 , apply_ctrl.confirmReject);
    router.get("/api/getApplyAttach/:id"                            , apply_ctrl.getApplyAttach);
    
const company_ctrl = require("./Company.CTRL");
    router.get("/api/getDepartList"           , company_ctrl.getDepartList);
    router.get("/api/getDepartChart"          , company_ctrl.getDepartChart)
    router.get("/api/getPositionList"         , company_ctrl.getPositionList);
    router.post("/api/insertChildren"         , company_ctrl.insertChildren);
    router.post("/api/updateDepart"           , company_ctrl.updateDepart);    
    router.post("/api/deleteDepart"           , company_ctrl.deleteDepart);    
    router.post("/api/getUsersInDepart"       , company_ctrl.getUsersInDepart);
    router.post("/api/addAdminUser"           , company_ctrl.addAdminUserProc);

const policy_manager_ctrl = require("./PolicyManager.CTRL");
    router.post("/api/getNode"                , policy_manager_ctrl.getNode);
    router.get("/api/getAllNode"              , policy_manager_ctrl.getAllNode);
    router.get("/api/getRootNode"             , policy_manager_ctrl.getRootNode);
    router.get("/api/getChildNode/:parentSeq" , policy_manager_ctrl.getChildNode);
    router.post("/api/deleteNode"             , policy_manager_ctrl.deleteNode);
    router.post("/api/saveNode"               , policy_manager_ctrl.saveNode);
    router.post("/api/filterSearch"           , policy_manager_ctrl.filterSearch);
    router.post("/api/modifyNode"             , policy_manager_ctrl.modifyNode);
    router.get("/api/exportFlowChart"         , policy_manager_ctrl.exportFlowChart);
    router.post("/api/importFlowChart"        , policy_manager_ctrl.importFlowChart);

const setting_ctrl = require("./Setting.CTRL");
    router.post("/api/getTakeOver"            , setting_ctrl.getTakeOver);
    router.post("/api/getTakeOverOne"         , setting_ctrl.getTakeOverOne);
    router.post("/api/getPolicyAdminList"     , setting_ctrl.getPolicyAdminList);
    router.post("/api/insertPolicyAdmin"      , setting_ctrl.insertPolicyAdmin);
    router.post("/api/deletePolicyAdmin"      , setting_ctrl.deletePolicyAdmin);
    router.post("/api/updatePolicyAdmin"      , setting_ctrl.updatePolicyAdmin);
    router.post("/api/getPolicyLimits"        , setting_ctrl.getPolicyLimits);
    router.post("/api/insertPolicyLimit"      , setting_ctrl.insertPolicyLimit);
    router.post("/api/updatePolicyLimit"      , setting_ctrl.updatePolicyLimit);
    router.post("/api/deletePolicyLimit"      , setting_ctrl.deletePolicyLimit);
    router.post("/api/getDeviceList"          , setting_ctrl.getDeviceList);
    router.post("/api/getSmtpInfo"            , setting_ctrl.getSmtpInfo);
    router.post("/api/saveSmtpSetting"        , setting_ctrl.saveSmtpSetting);
    router.post("/api/sendTestEmail"          , setting_ctrl.sendTestEmail);
    router.post("/api/sendMail"               , setting_ctrl.sendMail);
    router.post("/api/getMailForm"            , setting_ctrl.getMailForm);
    router.post("/api/getMailFormList"        , setting_ctrl.getMailFormList);
    router.post("/api/updateMailForm"         , setting_ctrl.updateMailForm);
    router.get("/api/getConfirmLineList/:userSeq"      , setting_ctrl.getConfirmLineList);
    router.post("/api/newConfirmLine"         , setting_ctrl.newConfirmLine);
    router.post("/api/deleteConfirmLine"      , setting_ctrl.deleteConfirmLine);
    router.post("/api/moveApplies"            , setting_ctrl.moveApplies);
    router.post("/api/approvalTakeOver"       , setting_ctrl.approvalTakeOver);

const collector_ctrl = require("./Collector.CTRL");
    router.post("/collector/getDeviceList"    , collector_ctrl.getDeviceList);
    router.post("/api/getInterestPolicies"    , collector_ctrl.getInterestPolicies);
    router.get("/api/getInterestPolicy/:ipSeq", collector_ctrl.getInterestPolicy);
    router.post("/api/setInterestPolicy"      , collector_ctrl.setInterestPolicy);
    router.get("/api/getDevice"               , collector_ctrl.getDevice);
    router.get("/api/getDeviceInfo/:deviceSeq", collector_ctrl.getDeviceInfo);
    router.post("/api/newDeviceInfo"          , collector_ctrl.newDeviceInfo);
    router.post("/api/setDeviceInfo"          , collector_ctrl.setDeviceInfo); 
    router.post("/api/deleteDevice"           , collector_ctrl.deleteDevice);
    router.get("/api/getDeviceFromCollector"  , collector_ctrl.getDeviceFromCollector);
    router.post("/api/getAllPolicy"           , collector_ctrl.getAllPolicy);
    router.post("/api/getUnusedPolicy"        , collector_ctrl.getUnusedPolicy);
    router.get("/api/getPolices/:deviceId"    , collector_ctrl.getPolices);
    router.get("/api/getPolicy/:deviceId/:policyNumber" , collector_ctrl.getPolicy);
    router.post("/api/getRelativePolices"     , collector_ctrl.getRelativePolices);
    router.get("/api/getNatPolices"           , collector_ctrl.getNatPolices);
    router.get("/api/getNatPolicyOne/:deviceId"  , collector_ctrl.getNatPolicyOne);
    router.get("/api/getObject/:type"         , collector_ctrl.getObject);
    router.post("/api/getAddress"             , collector_ctrl.getAddress);
    router.post("/api/getService"             , collector_ctrl.getService);
    router.post("/api/getUser"                , collector_ctrl.getUser);
    router.post("/api/getUserGroup"           , collector_ctrl.getUserGroup);
    router.get("/api/getMapData"              , collector_ctrl.getMapData);

const auth_ctrl = require("./Auth.CTRL");
// const { RelationQueryBuilder } = require("typeorm");
    router.post("/auth/login"                 , auth_ctrl.postLogin);
    router.post("/auth/getUserInfo"           , auth_ctrl.getUserInfo);

router.get('/', (req, res) => {
    res.send('404 . Not Found!')
  })

module.exports = router;
 

