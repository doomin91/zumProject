"use strict";
const axios = require("axios");
const cheerio = require("cheerio");
const UserModel = require('../models/userModel');

const getUserList = async(req, res) =>{
    return await UserModel.getUserList(req, res);
}

const getAdminList = async(req, res) =>{
    return await UserModel.getAdminList(req, res);
}

const getUser = async(req, res) =>{
    const USER_SEQ = req.query.userSeq;
    return await UserModel.findOne(USER_SEQ, res);
}

const deleteUser = async(req, res) =>{
    const data = {
        "USER_SEQ" : req.body.USER_SEQ
    }
    return await UserModel.deleteUser(data, res);
}

const updateUserInfo = async(req, res) =>{
    const data = {
        "USER_PASS" : req.body.USER_PASS,
        "USER_NAME" : req.body.USER_NAME,
        "USER_PHONE" : req.body.USER_PHONE,
        "USER_EMAIL" : req.body.USER_EMAIL,
        "USER_DEPARTMENT" : req.body.USER_DEPARTMENT,
        "USER_POSITION" : req.body.USER_POSITION,
        "USER_COMPANY_ID" : req.body.USER_COMPANY_ID,
        "USER_STATUS" : req.body.USER_STATUS,
        "USER_RULE_AUTH" : req.body.USER_RULE_AUTH,
        "USER_SEQ" : req.body.USER_SEQ
    }
    return await UserModel.updateUserInfo(data, res);
}

const createUserInfo = async(req, res) =>{
    const data = {
        "USER_ID" : req.body.USER_ID,
        "USER_PASS" : req.body.USER_PASS,
        "USER_NAME" : req.body.USER_NAME,
        "USER_PHONE" : req.body.USER_PHONE,
        "USER_EMAIL" : req.body.USER_EMAIL,
        "USER_DEPARTMENT" : req.body.USER_DEPARTMENT,
        "USER_POSITION" : req.body.USER_POSITION,
        "USER_COMPANY_ID" : req.body.USER_COMPANY_ID,
        "USER_STATUS" : req.body.USER_STATUS,
        "USER_RULE_AUTH" : req.body.USER_RULE_AUTH
    }
    return await UserModel.createUserInfo(data, res);
}

const searchUserList = async(req, res) =>{
    return await UserModel.searchAll(req, res);
}

const modifyAuth = async(req, res) =>{
    const data = {
        "USER_SEQ" : req.body.USER_SEQ,
        "USER_AUTH" : req.body.USER_AUTH
    }
    return await UserModel.modifyAuth(data, res);
}

const searchAdmin = async(req, res) =>{
    return await UserModel.searchAdmin(req, res);
}

// 함수 이전으로 전달 
module.exports = {
    getUser,
    getUserList,
    deleteUser,
    updateUserInfo,
    createUserInfo,
    searchUserList,
    getAdminList,
    modifyAuth,
    searchAdmin
}; 