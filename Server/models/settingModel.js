const ApplyEntity = require("../entities/Apply");
const TakeOverEntity = require("../entities/TakeOver");
const TakeOverLogEntity = require("../entities/TakeOverLog");
const PolicyLimitEntity = require("../entities/PolicyLimit");
const PolicyLimitRelationEntity = require("../entities/PolicyLimitRelation");
const DeviceEntity = require("../entities/Device");
const SmtpEntity = require("../entities/Smtp")
const MailFormEntity = require("../entities/MailForm");
const ConfirmLineEntity = require("../entities/ConfirmLine");
const { getRepository, Like } = require("typeorm");

exports.getTakeOver = async function(req, res){
    const TakeOverRepository = getRepository(TakeOverEntity);
    let Qurey = TakeOverRepository.createQueryBuilder("TAKE_OVER")
                    .where("DEL_YN = 'N'")
                    .leftJoinAndSelect("TAKE_OVER.FROM", "FROM")
                    .leftJoinAndSelect("TAKE_OVER.TO", "TO")
                    .orderBy("TAKE_OVER.APPROVAL_FLAG")
                    .addOrderBy("TAKE_OVER.REG_DATE", "DESC")
                    
                    

    const TakeOvers = await Qurey.getMany();
    res.json(TakeOvers);
}

exports.getTakeOverOne = async function(req, res){
    const TakeOverRepository = getRepository(TakeOverEntity);
    try {
        let Qurey = TakeOverRepository.createQueryBuilder("TAKE_OVER")
                    .where("SEQ = :seq", { seq : req.body.seq })
                    .leftJoinAndSelect("TAKE_OVER.FROM", "FROM")
                    .leftJoinAndSelect("TAKE_OVER.TO", "TO")
                    .leftJoinAndSelect("TO.DEPART_INFO", "DEPART_INFO")
                    .leftJoinAndSelect("TO.POSITION_INFO", "POSITION_INFO")

        const TakeOver = await Qurey.getOne();
        return TakeOver;
    } catch(err){
        return err;
    }
}

exports.updateTakeOver = async function(seq, data){
    const TakeOverRepository = getRepository(TakeOverEntity);
    try {
        let Qurey = TakeOverRepository.createQueryBuilder("TAKE_OVER")
                    .update()
                    .set(data)
                    .where("SEQ = :seq", { seq : seq })
                    .execute()

        return Qurey;
    } catch(err){
        return err;
    }
}

exports.insertTakeOverLog = async function(logData){
    const TakeOverLogRepository = getRepository(TakeOverLogEntity);
    try {
        let Query = TakeOverLogRepository.createQueryBuilder("TAKE_OVER_LOG")
                    .insert()
                    .values(logData)
                    .execute();

        return Query;
    } catch(err) {
        return err;
    }
}

/**
 * 
 * @param {Int} applySeq 
 * @param {Object} userInfo 
 * @returns 
 */
exports.takeOverProcess = async function(applySeq, userInfo){
    const ApplyRepository = getRepository(ApplyEntity);
    try {
        let Qurey = ApplyRepository.createQueryBuilder("APPLY")
            .update()
            .set({
                USER_SEQ : userInfo.USER_SEQ,
                APPLY_USER_NAME : userInfo.USER_NAME,
                APPLY_USER_POSITION : userInfo.POSITION_INFO.CODE_NAME,
                APPLY_USER_POSITION_SEQ : userInfo.POSITION_INFO.CODE_SEQ,
                APPLY_USER_DEPARTMENT : userInfo.DEPART_INFO.DEPARTMENT,
                APPLY_USER_DEPARTMENT_SEQ : userInfo.DEPART_INFO.DEPARTMENT_SEQ
            })
            .where("APPLY_SEQ = :applySeq", { applySeq : applySeq })
            .execute();

        return Qurey;
    } catch(err){
        return err;
    }
}

exports.getPolicyAdminList = async function(req, res){
    const PolicyLimitRelation = getRepository(PolicyLimitRelationEntity);
    const Query = await PolicyLimitRelation.createQueryBuilder("POLICY_LIMIT_RELATION")
                .where("DEL_YN = 'N'")
                .leftJoinAndSelect("POLICY_LIMIT_RELATION.LIMIT", "LIMIT")
                .leftJoinAndSelect("POLICY_LIMIT_RELATION.USER_INFO", "USER")
                .leftJoinAndSelect("USER.DEPART_INFO", "DEPART")
                .leftJoinAndSelect("USER.POSITION_INFO", "POSITION")
                .getMany();
    
    // console.log(Query);
    res.json(Query);
}

exports.checkPolicyRelation = async function(data){
    const PolicyLimitRelation = getRepository(PolicyLimitRelationEntity);   
    const Query = await PolicyLimitRelation.createQueryBuilder("POLICY_LIMIT_RELATION")
                .where()
                .andWhere()

    return Query.getOne();
}

exports.insertPolicyAdmin = async function(data){
    const PolicyLimitRelation = getRepository(PolicyLimitRelationEntity);
    const Query = await PolicyLimitRelation.createQueryBuilder("POLICY_LIMIT_RELATION")
                .insert()
                .values(data)
                
    return Query.execute();
}

exports.deletePolicyAdmin = async function(req, res){
    console.log(req.body.seq);
    const PolicyLimitRelation = getRepository(PolicyLimitRelationEntity);
    const Query = await PolicyLimitRelation.createQueryBuilder("POLICY_LIMIT_RELATION")
                .update()
                .set({ DEL_YN : 'Y' })
                .where("SEQ = :seq", { seq: req.body.seq })
                .execute();

    res.json(Query);
}
exports.updatePolicyAdmin = async function(req, res){
    return 1;
}

exports.getPolicyLimits = async function(req, res){
    const PolicyLimit = getRepository(PolicyLimitEntity);
    const Limits = await PolicyLimit.createQueryBuilder("POLICY_LIMIT")
                .where("POLICY_LIMIT.LIMIT_DEL_YN = 'N'")
                .orderBy("POLICY_LIMIT.LIMIT_SEQ", "DESC")
                .getMany();
    res.json(Limits);
}
exports.insertPolicyLimit = async function(req, res){
    const PolicyLimit = getRepository(PolicyLimitEntity);
    const Query = await PolicyLimit.createQueryBuilder("POLICY_LIMIT")
                .insert()
                .values({
                    LIMIT_TITLE: req.body.limitTitle,
                    LIMIT_DEFAULT_FLAG:req.body.defaultLimit,
                    LIMIT_APPLY:req.body.defultNum,
                    LIMIT_APPLY_RULE:req.body.applyNum,
                    LIMIT_RULE:req.body.accountNum,
                    LIMIT_PERIOD_FLAG:req.body.limitPeriod,
                    LIMITE_DEN_YN:'N'
                })
                .execute();
    res.json(Query);
}

exports.updatePolicyLimit = async function(data, limitSeq, res){
    console.log(data);
    const PolicyLimit = getRepository(PolicyLimitEntity);
    const Query = await PolicyLimit.createQueryBuilder("POLICY_LIMIT")
                .update()
                .set(data)
                .where("LIMIT_SEQ = :seq", {seq : limitSeq})
                .execute();

    res.json(Query);
}

exports.deletePolicyLimit = async function(req, res){
    const PolicyLimit = getRepository(PolicyLimitEntity);
    const Query = await PolicyLimit.createQueryBuilder("POLICY_LIMIT")
                .update()
                .set({ LIMIT_DEL_YN: "Y"})
                .where("LIMIT_SEQ = :seq", {seq : req.body.LIMIT_SEQ})
                .execute();

    res.json(Query);
}

exports.getDeviceList = async function(req, res){
    const DeviceRepository = getRepository(DeviceEntity);
    const Devices = await DeviceRepository.createQueryBuilder("DEVICE")
                    .orderBy("DEVICE.DEVICE_SEQ", "DESC")
                    .getMany();

    res.json(Devices);
}


exports.getSmtpInfo = async function(){
    const SmtpRepository = getRepository(SmtpEntity);
    const smtp = await SmtpRepository.createQueryBuilder("SMTP")
                .getOne();

    return smtp;
}

exports.insertSmtpInfo = async function(smtp){
    const SmtpRepository = getRepository(SmtpEntity);
    const result = await SmtpRepository.createQueryBuilder("SMTP")
                .insert()
                .values(smtp)
                .execute()
                
    return result;
}

exports.updateSmtpInfo = async function(seq, smtp){
    const SmtpRepository = getRepository(SmtpEntity);
    const result = await SmtpRepository.createQueryBuilder("SMTP")
                .where("SEQ = :seq", {seq : seq})
                .update()
                .set(smtp)
                .execute()

    return result;
}

exports.getMailForm = async function(req, res){
    const MailFormRepository = getRepository(MailFormEntity);
    const result = await MailFormRepository.createQueryBuilder("MAIL_FORM")
                .where("seq = :seq", {seq : req.body.seq})
                .getOne();

    res.json(result);
    }
    

exports.getMailFormList = async function(req, res){
    const MailFormRepository = getRepository(MailFormEntity);
    const result = await MailFormRepository.createQueryBuilder("MAIL_FORM")
                .getMany();

    res.json(result);
}

exports.updateMailForm = async function(mailFormSeq, data){
    const MailFormRepository = getRepository(MailFormEntity);
    const result = await MailFormRepository.createQueryBuilder("MAIL_FORM")
                .update()
                .set(data)
                .where("SEQ = :seq", {seq : mailFormSeq})
                .execute();
    return result;
}

exports.getConfirmLineList = async function(req, res){
    const ConfirmLineRepository = getRepository(ConfirmLineEntity);
    const result = await ConfirmLineRepository.createQueryBuilder("CONFIRM_LINE")
                .where("USER_SEQ = :userSeq", {userSeq : req.params.userSeq} )
                .getMany();

    res.json(result);
}

exports.newConfirmLine = async function(data){
    const ConfirmLineRepository = getRepository(ConfirmLineEntity);
    const result = await ConfirmLineRepository.createQueryBuilder("CONFIRM_LINE")
                .insert()
                .values(data)
                .execute();

    return result;R
}

exports.deleteConfirmLine = async function(req, res){
    const ConfirmLineRepository = getRepository(ConfirmLineEntity);
    const result = await ConfirmLineRepository.createQueryBuilder("CONFIRM_LINE")
                .delete()
                .where("SEQ = :seq", {seq : req.body.SEQ})
                .execute();
    
    res.json(result);
}

exports.moveApplies = async function(data){
    const TakeOverRepository = getRepository(TakeOverEntity);
    let Qurey = TakeOverRepository.createQueryBuilder("TAKE_OVER")
                .insert()
                .values(data)
                .execute();

    return Qurey;
}

exports.getDeviceInfo = async function(req, res){
    const DeviceRepository = getRepository(DeviceEntity);
    let Qurey = await DeviceRepository.createQueryBuilder("DEVICE")
                .where(`DEVICE_SEQ = ${req.params.deviceSeq}`)
                .getOne();

    res.json(Qurey);
}

exports.getDevice = async function(deviceSeq){
    const DeviceRepository = getRepository(DeviceEntity);
    let Qurey = await DeviceRepository.createQueryBuilder("DEVICE")
                .where(`DEVICE_SEQ = ${deviceSeq}`)
                .getOne();

    return Qurey;
}

exports.insertDevice = async function(data){
    const DeviceRepository = getRepository(DeviceEntity);
    let Qurey = await DeviceRepository.createQueryBuilder("DEVICE")
                .insert()
                .values(data)
                .execute()
    
    return Qurey;
}

exports.updateDevice = async function(data, deviceSeq){
    const DeviceRepository = getRepository(DeviceEntity);
    let Qurey = await DeviceRepository.createQueryBuilder("DEVICE")
                .update()
                .set(data)
                .where(`DEVICE_SEQ = ${deviceSeq}`)
                .execute()
    return Qurey;
}

exports.deleteDevice = async function(deviceSeq){
    try {
        const DeviceRepository = getRepository(DeviceEntity);
        let Qurey = await DeviceRepository.createQueryBuilder("DEVICE")
        .delete()
        .where(`DEVICE_SEQ = ${deviceSeq}`)
        .execute();
        return Qurey;
    } catch(error) {
        return error;
    }
}