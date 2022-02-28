"use strict";
const axios = require("axios");
const cheerio = require("cheerio");
const AuthModel = require('../models/AuthModel');

const postLogin = async(req, res) =>{
    return await AuthModel.PostUserLogin(req, res);
};

const getUserInfo = async(req, res) =>{
    return await AuthModel.getUserInfo(req, res);
}

// 함수 이전으로 전달 
module.exports = {
    postLogin,
    getUserInfo,
}; 