const DepartEntity = require("../entities/Depart");

const { getRepository } = require("typeorm");

exports.findAll = async function(req, res){ 
  const DepartRepository = getRepository(DepartEntity);
  const departments = await DepartRepository.find();

  res.json(departments);
}

exports.getDepartChart = async function(req, res){
  const DepartRepository = getRepository(DepartEntity);
  const Query = await DepartRepository.createQueryBuilder("DEPART")
                .where("DEPARTMENT_DEL_YN = 'N'")
                .orderBy("DEPART.REF", "ASC")
                .addOrderBy("DEPART.PID", "ASC")
                .addOrderBy("DEPART.DEPARTMENT_SEQ", "ASC")
                .getMany();

  res.json(Query);
}
