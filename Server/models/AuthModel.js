const db = require("../lib/database");
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const UserEntity = require("../entities/User");

const privateKey = 'dinner';
const refreshKey = 'refresh';

const { getRepository } = require("typeorm");


// exports.getUserInfo = function(request, response){
//     const TokenVerification = CheckVerify(request);
//     console.log(request.headers);
//     if(TokenVerification.result == true){
//         var PARMS = [TokenVerification.data.USER_ID];
//             const query = db.query(`SELECT * FROM TBL_FW_USER WHERE USER_ID = ? `, PARMS ,function(error , resultData){
//                 if(resultData.length < 1){
//                     return response.header('AUTH_ACCESS_CD', TokenVerification.NewToken).json({code: 403, msg: '데이터가 없습니다.'});
//                 }else{
//                     const jsonData = {}
//                     jsonData.code = 200
//                     jsonData.msg = '인증 성공'
//                     jsonData.data = resultData[0]
//                     return response.header('AUTH_ACCESS_CD', TokenVerification.NewToken).json(jsonData);
//                 }
//             });
//     }else{
//         return response.json({code: 404,   msg: '인증되지 않았거나, 토큰이 만료 되었습니다.' });
//     }
// };

exports.getUserInfo = async function(request, response){
    const TokenVerification = await CheckVerify(request);
    if(TokenVerification.result == true){
        const UserRepository = getRepository(UserEntity)
        const qurey = await UserRepository.createQueryBuilder("USER")
            .where(`USER_ID = '${TokenVerification.data.USER_ID}'`)
            .getMany();

        const resultData = qurey;
            if(resultData.length < 1){
                return response.header('AUTH_ACCESS_CD', TokenVerification.NewToken).json({code: 403, msg: '데이터가 없습니다.'});
            } else {
                const jsonData = {}
                jsonData.code = 200
                jsonData.msg = '인증 성공'
                jsonData.data = resultData[0]
                return response.header('AUTH_ACCESS_CD', TokenVerification.NewToken).json(jsonData);
            }
    }else{
        return response.json({code: 404,   msg: '인증되지 않았거나, 토큰이 만료 되었습니다.' });
    }
};

const CheckVerify = function (request) {
    const token = request.headers['accesstoken'];
    // console.log('header:'+token)
   return jwt.verify(token, privateKey, (err, decoded) => {
        if (err){
            return false;
        } else{
            return {result : true, data:decoded};
        }
    });
} 

exports.CheckKeyVerify = async function (request, response) {
    console.log(request.headers)
    const token = request.headers['accesstoken'];
    if(token != null){
        response.json(
            await jwt.verify(token, privateKey, (err, decoded) => {
                if (err){
                    return ({code:401, msg: '토큰이 만료 되었습니다.'});
                } else{
                    return ({code:200, msg: '인증성공'});
                }
            })
        )
    }else{
        response.json({code:404, msg: '인증되지 않았거나, 토큰이 만료 되었습니다.'})
    }
} 

const CreateToken = function (request){
    return {accessToken : jwt.sign({ 
        USER_ID: request.USER_ID,
        USER_NAME: request.USER_NAME,
     }, privateKey, { expiresIn: '30m' }),
     refreshToken: jwt.sign({ 
        USER_ID: request.USER_ID,
        USER_NAME: request.USER_NAME,
     }, refreshKey, { expiresIn: '60m' })}
     ;
}
    
exports.PostUserLogin = async function(request, response){
    const secret = request.app.get('jwt-secret')
    // console.log(request.body);
    try {
        const UserRepository = getRepository(UserEntity)
        const qurey = await UserRepository.createQueryBuilder("USER")
                    .where(`USER_ID = '${request.body.userid}'`)
                    .andWhere(`USER_PASS = '${request.body.userpwd}'`)
                    .getMany()

        const ReturnData=JSON.parse(JSON.stringify(qurey));
        if(ReturnData.length > 0){
             const upgradeBase64crypto = async (RowData) => {
                const token = await CreateToken(RowData);
                console.log(token);
                const updateQurey = await UserRepository.createQueryBuilder("USER")
                    .update()
                    .set({
                        USER_AUTH_REFRESH_TOKEN : token.refreshToken,
                    })
                    .where(`USER_ID = '${request.body.userid}'`)
                    .andWhere(`USER_PASS = '${request.body.userpwd}'`)
                    .execute()
                    if(updateQurey){
                        return response.json({code: 200,  msg: '로그인 성공', result:  {userid: request.body.userid, access_token: token.accessToken, refresh_token: token.refreshToken} });    
                    } 
                }
            const hash = upgradeBase64crypto(ReturnData[0]);
        }else{
            return response.status(200).json({code: 402,   msg: '비밀번호가 틀렸습니다.' });
        }

    } catch (error) {
        throw error
    }
}; 


// exports.PostUserLogin = function(request, response){
//     console.log(request);
//     const secret = request.app.get('jwt-secret')
//     try {
//         var PARMS = [request.body.userid,request.body.userpwd];
//         const query = db.query(`SELECT * FROM TBL_FW_USER WHERE USER_ID = ? AND USER_PASS = ?`, db.escape(PARMS),function(error , resultData){
//             console.log(resultData);
//             if(error){
//                 console.log(error);
//                 return response.status(200).json({code: 401,   msg: '비밀번호가 틀렸습니다.'+error });
//             }else{
//                 const ReturnData=JSON.parse(JSON.stringify(resultData));
//                 if(ReturnData.length >0){
//                     const  upgradeBase64crypto =  RowData => {
//                         const token = CreateToken(RowData);
//                         var Parms_Update = [token.refreshToken, request.body.userid, request.body.userpwd];
//                         const query = db.query(`UPDATE TBL_FW_USER SET USER_AUTH_REFRESH_TOKEN = ?  WHERE USER_ID = ? AND USER_PASS = ?`, Parms_Update,function(error , uptResult){
//                             return response.json({code: 200,  msg: '로그인 성공', result:  {userid: request.body.userid, access_token: token.accessToken, refresh_token: token.refreshToken} });    
//                         });
//                     }
//                     const hash = upgradeBase64crypto(ReturnData[0]);
//                 }else{
//                     return response.status(200).json({code: 402,   msg: '비밀번호가 틀렸습니다.' });
//                 }
//             }
//         });
//     } catch (error) {
//         throw error
//     }
// }; 

//connection.end();