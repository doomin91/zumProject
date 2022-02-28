const InterestPolicyEntity = require("../entities/InterestPolicy");

const { getRepository } = require("typeorm");
const { Query } = require("typeorm/driver/Query");

exports.getInterestPolicies = async function(req, res){ 
  try {

    const InterestPolicyRepository = getRepository(InterestPolicyEntity);
    const polices = await InterestPolicyRepository.createQueryBuilder("INTEREST_POLICY")
                    .leftJoinAndSelect("INTEREST_POLICY.DEVICE_INFO", "DEVICE_INFO")
                    .orderBy("INTEREST_POLICY.CREATE_DATE", "DESC")
                    .getMany();
    res.json(polices);
  } catch(error) {
    return error;
  }
}

exports.getInterestPolicy = async function(ipSeq){
  try {
    const InterestPolicyRepository = getRepository(InterestPolicyEntity);
    const result = await InterestPolicyRepository.createQueryBuilder("INTEREST_POLICY")
                    .where(`IP_SEQ = ${ipSeq}`)
                    .leftJoinAndSelect("INTEREST_POLICY.DEVICE_INFO", "DEVICE_INFO")
                    .getOne();
    
    return result;
  } catch(error) {
    return error;
  }
}

exports.setInterestPolicy = async function(data){
  try {
    const InterestPolicyRepository = getRepository(InterestPolicyEntity);
    const result = await InterestPolicyRepository.createQueryBuilder("INTEREST_POLICY")
                    .insert()
                    .values(data)
                    .execute();
    
    return result;
  } catch(error) {
    return error
  }
}