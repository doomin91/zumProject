
const SettingModel = require('../models/settingModel');
const InterestPolicyModel = require('../models/interestPolicyModel');
const { sendCurlToCollector } = require("../lib/collector");

const getDeviceList = async(req, res) =>{
    return await SettingModel.getDeviceList(req, res);
}

const getInterestPolicies = async(req, res) =>{
    return await InterestPolicyModel.getInterestPolicies(req,res);
}

const getInterestPolicy = async(req, res) =>{
    const ipSeq = req.params.ipSeq;
    const result = await InterestPolicyModel.getInterestPolicy(ipSeq);
    res.json(result);
}

const setInterestPolicy = async(req, res) =>{
    const jsonData = JSON.parse(req.body.POLICY_DATA);
    const newIPolicy = await InterestPolicyModel.setInterestPolicy(req.body);
    jsonData.forEach(async element => {
        const data = {
            device_id: req.body.DEVICE_ID,
            policy_number: element.policy_number,
            start_date: req.body.START_DATETIME,
            end_date: req.body.END_DATETIME,
            status: "Y",
            ip_seq: newIPolicy.raw.insertId
        }
        const request = await sendCurlToCollector("POST", "/Monitoring/setInterestPolicy", data, "");
    })

    res.json(newIPolicy);
}

const getDeviceInfo = async(req, res) =>{
    return await SettingModel.getDeviceInfo(req, res);
}

const newDeviceInfo = async(req, res) =>{
    let resultMsg;
    const now = new Date();
    const data = {
        REG_DATE : now,
        DEVICE_NAME : req.body.deviceName,
        DEVICE_IP : req.body.deviceIp,
        DEVICE_VENDOR : req.body.deviceVendor,
        USER_ID : req.body.userId,
        PASSWORD : req.body.password,
        PORT : req.body.port,
        PROTOCOL : req.body.protocol,
        RETRIEVAL_FLAG : 'N',
        CHANGE_FLAG : 'N',
        LOG_FLAG : 'N'
    }

    const result = await SettingModel.insertDevice(data);
    if(result.raw.insertId){
        const deviceSeq = result.raw.insertId;
        const device = await SettingModel.getDevice(deviceSeq);
        const regex = / /gi;
        const data = {
            "domain_id": 0,
            "device_id": device.DEVICE_SEQ,
            "device_name": device.DEVICE_NAME.trim().replace(regex ,"_"),
            "device_ip": device.DEVICE_IP,
            "device_vendor": device.DEVICE_VENDOR,
            "id": device.USER_ID,
            "pwd": device.PASSWORD,
            "protocol": "NULL",
            "port": device.PORT
          }
        const createDeviceProc = await sendCurlToCollector("POST", "/Device/setDevice", data, "");
        if(createDeviceProc.code == 200){
            resultMsg = {
                code : 200,
                msg : "정상적으로 등록되었습니다."
            }
        } else {
            const transaction = await SettingModel.deleteDevice(deviceSeq);
            resultMsg = {
                code : 201,
                msg : "수집서버 등록에 실패했습니다. 다시 시도해주세요.",
                transaction : transaction
            }
        }
    }else {
        resultMsg = {
            code : 201,
            msg : "WITHVTM에 등록에 실패했습니다."
        }
    }

    res.json(resultMsg);
}

const setDeviceInfo = async(req, res) =>{
    let result, resultMsg;
    const deviceSeq = req.body.deviceSeq;
    let data = {
        "device_name": req.body.deviceName,
        "device_ip": req.body.deviceIp,
        "device_vendor": req.body.deviceVendor,
        "id": req.body.userId,
        "pwd": req.body.password,
        "port": req.body.port,
        "protocol": ""
    }
    // result = await SettingModel.updateDevice(data, deviceSeq);
    // resultMsg = {
    //     code: 200,
    //     msg: "수정되었습니다.",
    // }

    // 현재 수집서버 기능 구현 안됨, 수정 시 수집서버도 수정되도록 설정 예정
    const updateDeviceProc = await sendCurlToCollector("POST", "/Device/editDevice?device_id=" + deviceSeq , data, "");
    console.log(updateDeviceProc);
    if(updateDeviceProc.data){
        let data = {
            DEVICE_NAME : req.body.deviceName,
            DEVICE_IP : req.body.deviceIp,
            DEVICE_VENDOR : req.body.deviceVendor,
            USER_ID : req.body.userId,
            PASSWORD : req.body.password,
            PORT : req.body.port,
            PROTOCOL : ""
        }
        result = await SettingModel.updateDevice(data, deviceSeq);
        resultMsg = {
            code: 200,
            msg: "수정되었습니다.",
            response: updateDeviceProc
        }
    } else {
        resultMsg = {
            code: 201,
            msg: "수집서버와 연동이 되지 않았습니다.",
            response: updateDeviceProc
        }
    }
    res.json(resultMsg);
}

const deleteDevice = async(req, res) =>{
    let result, returnMsg;
    const deviceSeq = req.body.deviceSeq;
    console.log(req.body);
    let deleteProc = await sendCurlToCollector("POST", `/Device/deleteDevice?device_id=${deviceSeq}`, "", "");
    console.log(deleteProc);
    if(deleteProc.data.result == 200) {
        result = await SettingModel.deleteDevice(deviceSeq);
        console.log(result);
        if(result) {
            returnMsg = {
                code: 200,
                msg: "삭제 성공"
            }
        } else {
            returnMsg = {
                code: 201,
                msg: "수집서버는 삭제 되었으나, DB 삭제 실패했습니다."
            }
        }
    } else {
        returnMsg = {
            code: 202,
            msg: "삭제 실패"
        }
    }
    
    res.json(returnMsg);
}

const getDeviceFromCollector = async(req, res) =>{
    const result = await sendCurlToCollector("GET", "/Device", "", "");
    res.json(result);
}

// /Policy/All
const getAllPolicy = async(req, res) =>{
    const data = JSON.stringify(req.body);
    console.log(data);
    const result = await sendCurlToCollector("GET", `/Policy/all?q=` + data , "", "");
    console.log(result);
    res.json(result);
}

const getUnusedPolicy = async(req, res) =>{
    const data = JSON.stringify(req.body);
    const result = await sendCurlToCollector("GET", `/Policy/unUsed/?q=` + data, "", "");
    res.json(result);
}

// /Policy/{device_id}
const getPolices = async(req, res) =>{
    const deviceId = req.params.deviceId
    const result = await sendCurlToCollector("GET", `/Policy/${deviceId}` , "", "");
    res.json(result);
}

const getPolicy = async(req, res) =>{
    const deviceId = req.params.deviceId;
    const policyNumber = req.params.policyNumber;
    const result = await sendCurlToCollector("GET", `/Policy/${deviceId}?q={"policy_number":${policyNumber}}` , "", "");
    res.json(result);
}

const getRelativePolices = async(req, res) =>{
    console.log(req.body);
    const deviceId = req.body.device_id;
    const to = req.body.to;
    const from = req.body.from;
    const source = req.body.source;
    const destination = req.body.destination;
    const service = req.body.service;
    
    let result_array = [];


    source.forEach(source => {
        destination.forEach(destination => {
            service.forEach(service => {
                console.log(source.ip + " / " + destination.ip + " / " + service);
            })
        })
    })

    const data = {
        device_id: deviceId,
        service_condition: "equals",
        service: "",
        source_zone_condition: "equals",
        source_zone: from,
        destination_zone_condition: "equals",
        destination_zone: to,
        source_condition: "equals",
        source: "",
        destination_condition: "equals",
        destination: ""
    }

    console.log(data);
    let json = JSON.stringify(data);
    const result = await sendCurlToCollector("GET", `/Policy/all?q=${json}`, "", "");
    result_array.push(result.data.policy);
    console.log(result_array);
}

// /Nat/all
const getNatPolices = async(req, res) =>{
    const result = await sendCurlToCollector("GET", `/Nat/all`, "", "");
    res.json(result);
}

// /Nat/{device_id}
const getNatPolicyOne = async(req, res) =>{
    const deviceId = req.body.DEVICE_ID
    const result = await sendCurlToCollector("GET", `/Nat/${deviceId}`, "", "");
    res.json(result);
}

// /Device
const getDevice = async(req, res) =>{
    const result = await sendCurlToCollector("GET", `/Device`, "", "");
    res.json(result);
}

// /Object
const getObject = async(req, res) =>{
    let returnMsg;
    const type = req.params.type;
    const result = await sendCurlToCollector("GET", `/Object`, "", "");
    if(result.code == 200){
        const objects = result.data.objects;
        let objectData = [];
        objects.forEach(element => {
            if(element.object_type == type){
                objectData.push(element);
            }
        })
        returnMsg = {
            code: 200,
            msg: "데이터 조회 완료",
            objects: objectData
        }
    }else {
        returnMsg = {
            code: 403,
            msg: "데이터 조회 실패"
        }
    }
    
    res.json(returnMsg);
}

/**
 * /Object/address
 * @body {"device_id":", "object_name":"", "ip":""}
 */
const getAddress = async(req, res) =>{
    const data = JSON.stringify(req.body);
    console.log(data);
    const result = await sendCurlToCollector("GET", `/Object/address?q=` + data, "", "");
    res.json(result);
}

/**
 * /Object/service
 * @body {"device_id":1,"object_name":"", "port":""}
 */
const getService = async(req, res) =>{
    const data = JSON.stringify(req.body);
    const result = await sendCurlToCollector("GET", `/Object/service?q=` + data, "", "");
    res.json(result);
}

/**
 * /Object/user
 * @body {"device_id":1, "object_name":"", "group_name":""}
 */
const getUser = async(req, res) =>{
    const data = JSON.stringify(req.body);
    const result = await sendCurlToCollector("GET", `/Object/user?q=` + data, "", "");
    res.json(result);
}

/**
 * 
 * {"device_id":1,"object_name":"", "group_name":""}
 * @param {*} res 
 */

const getUserGroup = async(req, res) =>{
    const data = JSON.stringify(req.body);
    const result = await sendCurlToCollector("GET", `/Object/userGroup?q=` + data, "", "");
    res.json(result);
}
// /Nat/{device_id}

const getMapData = async(req, res) =>{
    // const data = JSON.stringify(req.body);
    const result = await sendCurlToCollector("GET", "/MapData", "", "");
    res.json(result);
}

// 함수 이전으로 전달 
module.exports = {
    getDeviceList,
    getInterestPolicies,
    getInterestPolicy,
    setInterestPolicy,
    getDevice,
    getDeviceInfo,
    newDeviceInfo,
    setDeviceInfo,
    deleteDevice,
    getDeviceFromCollector,
    getAllPolicy,
    getUnusedPolicy,
    getPolices,
    getPolicy,
    getRelativePolices,
    getNatPolices,
    getNatPolicyOne,
    getObject,
    getAddress,
    getService,
    getUser,
    getUserGroup,
    getMapData
}; 