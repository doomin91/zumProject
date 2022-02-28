"use strict";
const axios = require("axios");
const cheerio = require("cheerio");
const ApplyModel = require('../models/applyModel');
const fs = require('fs')


const checkApplyInWriting = async (req, res) =>{
    try{
        const Apply = await ApplyModel.checkApplyInWriting(req, res);
        return res.json(Apply);
    }catch(err){
        console.log(err);
        return err;
    }
}

const deleteApplyInWriting = async (req, res) =>{
    try{
        const Apply = await ApplyModel.deleteApplyInWriting(req, res);
        return res.json(Apply);
    }catch(err){
        console.log(err);
        return err;
    }
}

const getApply = async (req, res) =>{
    try{
        const Apply = await ApplyModel.getApply(req, res);
        return res.json(Apply);
    }catch(err){
        console.log(err);
        return err;
    }
}

const getApplyStatus = async (req, res) =>{
    try{
        const Apply = await ApplyModel.getApplyStatus(req, res);
        return res.json(Apply);
    }catch(err){
        console.log(err);
        return err;
    }
}

const getApplies = async (req, res) =>{
    try{
        const Applies = await ApplyModel.getApplies(req, res);
        return res.json(Applies);
    }catch(err){
        console.log(err);
        return err;
    }
}

const getMyApplies = async (req, res) =>{
    try{
        const MyApplies =  await ApplyModel.getMyApplies(req, res);
        // console.log(MyApplies);
        return res.json(MyApplies);
    }catch(err){
        return err;
    }
}

const getApplyCopyData = async (req, res) =>{
    try{
        const CopyData =  await ApplyModel.getApplyCopyData(req, res);
        // console.log(MyApplies);
        return res.json(CopyData);
    }catch(err){
        return err;
    }
}

const checkCopyData = async (req, res) =>{
    try{
        // console.log("checkCopyData");
        const CopyData =  await ApplyModel.checkCopyData(req, res);
        // console.log(MyApplies);
        
        return res.json(CopyData);
    }catch(err){
        return err;
    }
}

const getLatestConfirmLine = async (req, res) => {
    // console.log(req);
    try{    
        const Confrims =  await ApplyModel.getLatestConfirmLine(req, res);
        return res.json(Confrims);
    }catch(err){
        return err;
    }
}

const getCurrentUserInfo = async (req, res) => {
    try{
        const UserInfo =  await ApplyModel.getCurrentUserInfo(req, res);
        // console.log(UserInfo);
        return res.json(UserInfo);
    }catch(err){
        return err;
    }
}

const saveAppForm = async (req, res) => {
    try{
        // console.log(req);
        const Result =  await ApplyModel.saveAppForm(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

const editAppForm = async (req, res) => {
    try{
        const Result =  await ApplyModel.editAppForm(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

const saveAppForm2 = async (req, res) => {
    try{
        // console.log(req);
        const Result =  await ApplyModel.saveAppForm2(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

const editAppForm2 = async (req, res) => {
    try{
        // console.log(req);
        const Result =  await ApplyModel.editAppForm2(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

const saveApply = async (req, res) => {
    try{
        // console.log(req);
        const Result =  await ApplyModel.saveApply(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

const applyWork = async (req, res) => {
    try{
        const Result =  await ApplyModel.applyWork(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

const editApplyAtWork = async (req, res) => {
    try{
        // console.log(req);
        const Result =  await ApplyModel.editApplyAtWork(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

const editApplyAtWorkCancel = async (req, res) => {
    try{
        // console.log(req);
        const Result =  await ApplyModel.editApplyAtWorkCancel(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res
 * @varable {Int} Flag 1: 정책, Fla 2: NAT
 * @returns 
 */
const checkFileSignatureAndParse = async (req, res) => {
    try{
        // 파일 시그니쳐 = 504B030414000600 : xlsx, D0CF11E0A1B11AE1 : xls
        const FileSignatureData = req.files.File.data.toString("hex", 0, 8);
        const Signature = ['504b030414000600', 'D0CF11E0A1B11AE1'];
        console.log(req.files.File.data);
        console.log(FileSignatureData);
        console.log(Signature);
        const Flag = req.body.Flag;
        console.log(Flag);
        const Rules = [];
        const natRules = [];

        if(Signature.includes(FileSignatureData)){
            console.log("있따");
            try {
                // const Excel = require('exceljs');
                // const Workbook = new Excel.Workbook();
                
                return res.json(true);
            }catch (err) {
                console.error(err);
                return err;
            }
        }else{
            console.log("없다");
            return res.json(false);
        }

    }catch(err){
        return err;
    }
}

const confirmApprove = async (req, res) => {
    try{
        // console.log(req);
        const Result =  await ApplyModel.confirmApprove(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

const confirmReject = async (req, res) => {
    try{
        // console.log(req);
        const Result =  await ApplyModel.confirmReject(req, res);
        // console.log(Result);
        return res.json(Result);
    }catch(err){
        return err;
    }
}

const getApplyAttach = async (req, res) => {
    try{
        // console.log(req);
        const Attach =  await ApplyModel.getApplyAttach(req, res);
        console.log(Attach);
        try {
            const data = fs.readFileSync(`./${Attach.FILE_PATH}`);
            const json = JSON.stringify({ blob: data.toString("base64") });
            // console.log(data)
            return res.json(json);
        }catch (err) {
            console.error(err)
        }
        
    }catch(err){
        return err;
    }
}

// 함수 이전으로 전달 
module.exports = {
    checkApplyInWriting,
    deleteApplyInWriting,
    getApply,
    getApplyStatus,
    getApplies,
    getMyApplies,
    getApplyCopyData,
    checkCopyData,
    getLatestConfirmLine,
    getCurrentUserInfo,
    saveAppForm,
    editAppForm,
    saveAppForm2,
    editAppForm2,
    saveApply,
    applyWork,
    editApplyAtWork,
    editApplyAtWorkCancel,
    confirmApprove,
    confirmReject,
    getApplyAttach,
    checkFileSignatureAndParse
}; 