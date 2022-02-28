import axios from 'axios';

const CollectorServer = {
    uri:"http://192.168.210.20:8000",
    token:""
}

exports.sendCurlToCollector = async function(method, url, data="", header=""){
    let result;
    if(method == "GET") {
        await axios.get(CollectorServer.uri + url, data, header)
            .then(res =>{
                if(res.data){
                    result = {
                        code: 200,
                        msg: "request success",
                        data: res.data
                    }
                } else {
                    result = {
                        code: 201,
                        msg: "request failed"
                    }
                }
            })
            .catch(err => {
                result = {
                    code: 202,
                    msg: err
                };
            })
    } else if(method == "POST") {
        await axios.post(CollectorServer.uri + url, data, header)
        .then(res =>{
            if(res.data){
                result = {
                    code: 200,
                    msg: "request success",
                    data: res.data
                }
            } else {
                result = {
                    code: 201,
                    msg: "request failed"
                }
            }
        })
        .catch(err => {
            result = {
                code: 202,
                msg: err
            };
        })
    } else if(method == "PUT") {
        await axios.put(CollectorServer.uri + url, data, header)
        .then(res =>{
            if(res.data){
                result = {
                    code: 200,
                    msg: "request success",
                    data: res.data
                }
            } else {
                result = {
                    code: 201,
                    msg: "request failed"
                }
            }
        })
        .catch(err => {
            result = {
                code: 202,
                msg: err
            };
        })
    } else if(method == "DELETE") {
        await axios.put(CollectorServer.uri + url, data, header)
        .then(res =>{
            if(res.data){
                result = {
                    code: 200,
                    msg: "request success",
                    data: res.data
                }
            } else {
                result = {
                    code: 201,
                    msg: "request failed"
                }
            }
        })
        .catch(err => {
            result = {
                code: 202,
                msg: err
            };
        })
    } else {
        result = {
            code: 203,
            msg: "지원되지 않는 METHOD 입니다."
        }
    }
    
    return result;
}
