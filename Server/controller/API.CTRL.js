"use strict";
const axios = require("axios");
const cheerio = require("cheerio");
const ProjectModel = require('../models/projectModel');
const DepartModel = require('../models/departModel');
// const UserModel = require('../models/userModel');
const PostionModel = require('../models/positionModel');

const getDepartList = async(req, res) =>{
    return await DepartModel.findAll(req, res);
}

const getDepartChart = async(req, res) =>{
    return await DepartModel.getDepartChart(req, res);
}

const getPositionList = async(req, res) =>{
    return await PostionModel.findAll(req, res);
}

// 함수 이전으로 전달 
module.exports = {
    getDepartList,
    getDepartChart,
    getPositionList
}; 