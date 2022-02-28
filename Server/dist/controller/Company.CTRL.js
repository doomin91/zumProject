"use strict";
const axios = require("axios");
const cheerio = require("cheerio");
const DepartModel = require('../models/departModel');
const CompanyModel = require('../models/companyModel');
const getDepartList = async (req, res) => {
    return await DepartModel.findAll(req, res);
};
const getDepartChart = async (req, res) => {
    return await DepartModel.getDepartChart(req, res);
};
const getPositionList = async (req, res) => {
    const result = await CompanyModel.getPositionList(req, res);
    res.json(result);
};
const insertChildren = async (req, res) => {
    return await CompanyModel.insertChildren(req, res);
};
const updateDepart = async (req, res) => {
    return await CompanyModel.updateDepart(req, res);
};
const deleteDepart = async (req, res) => {
    return await CompanyModel.deleteDepart(req, res);
};
const getUsersInDepart = async (req, res) => {
    return await CompanyModel.getUsersInDepart(req, res);
};
const addAdminUserProc = (req, res) => {
    let result;
    req.body.forEach(element => {
        let data = {
            userSeq: element.USER_SEQ
        };
        result = CompanyModel.addAdminUser(data, res);
    });
    return result;
};
module.exports = {
    getDepartList,
    getDepartChart,
    getPositionList,
    insertChildren,
    updateDepart,
    deleteDepart,
    getUsersInDepart,
    addAdminUserProc
};
//# sourceMappingURL=Company.CTRL.js.map