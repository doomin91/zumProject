const db = require("../lib/database");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserEntity = require("../entities/User");
const privateKey = 'dinner';
const refreshKey = 'refresh';
const { getRepository } = require("typeorm");
exports.getUserInfo = async function (request, response) {
    const TokenVerification = await CheckVerify(request);
    if (TokenVerification.result == true) {
        const UserRepository = getRepository(UserEntity);
        const qurey = await UserRepository.createQueryBuilder("USER")
            .where(`USER_ID = '${TokenVerification.data.USER_ID}'`)
            .getMany();
        const resultData = qurey;
        if (resultData.length < 1) {
            return response.header('AUTH_ACCESS_CD', TokenVerification.NewToken).json({ code: 403, msg: '데이터가 없습니다.' });
        }
        else {
            const jsonData = {};
            jsonData.code = 200;
            jsonData.msg = '인증 성공';
            jsonData.data = resultData[0];
            return response.header('AUTH_ACCESS_CD', TokenVerification.NewToken).json(jsonData);
        }
    }
    else {
        return response.json({ code: 404, msg: '인증되지 않았거나, 토큰이 만료 되었습니다.' });
    }
};
const CheckVerify = function (request) {
    const token = request.headers['accesstoken'];
    return jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            return false;
        }
        else {
            return { result: true, data: decoded };
        }
    });
};
exports.CheckKeyVerify = async function (request, response) {
    console.log(request.headers);
    const token = request.headers['accesstoken'];
    if (token != null) {
        response.json(await jwt.verify(token, privateKey, (err, decoded) => {
            if (err) {
                return ({ code: 401, msg: '토큰이 만료 되었습니다.' });
            }
            else {
                return ({ code: 200, msg: '인증성공' });
            }
        }));
    }
    else {
        response.json({ code: 404, msg: '인증되지 않았거나, 토큰이 만료 되었습니다.' });
    }
};
const CreateToken = function (request) {
    return { accessToken: jwt.sign({
            USER_ID: request.USER_ID,
            USER_NAME: request.USER_NAME,
        }, privateKey, { expiresIn: '30m' }),
        refreshToken: jwt.sign({
            USER_ID: request.USER_ID,
            USER_NAME: request.USER_NAME,
        }, refreshKey, { expiresIn: '60m' }) };
};
exports.PostUserLogin = async function (request, response) {
    const secret = request.app.get('jwt-secret');
    try {
        const UserRepository = getRepository(UserEntity);
        const qurey = await UserRepository.createQueryBuilder("USER")
            .where(`USER_ID = '${request.body.userid}'`)
            .andWhere(`USER_PASS = '${request.body.userpwd}'`)
            .getMany();
        const ReturnData = JSON.parse(JSON.stringify(qurey));
        if (ReturnData.length > 0) {
            const upgradeBase64crypto = async (RowData) => {
                const token = await CreateToken(RowData);
                console.log(token);
                const updateQurey = await UserRepository.createQueryBuilder("USER")
                    .update()
                    .set({
                    USER_AUTH_REFRESH_TOKEN: token.refreshToken,
                })
                    .where(`USER_ID = '${request.body.userid}'`)
                    .andWhere(`USER_PASS = '${request.body.userpwd}'`)
                    .execute();
                if (updateQurey) {
                    return response.json({ code: 200, msg: '로그인 성공', result: { userid: request.body.userid, access_token: token.accessToken, refresh_token: token.refreshToken } });
                }
            };
            const hash = upgradeBase64crypto(ReturnData[0]);
        }
        else {
            return response.status(200).json({ code: 402, msg: '비밀번호가 틀렸습니다.' });
        }
    }
    catch (error) {
        throw error;
    }
};
//# sourceMappingURL=AuthModel.js.map