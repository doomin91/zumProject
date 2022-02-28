const FlowChartEntity = require("../entities/FlowChart");
const FlowChartFilterEntity = require("../entities/FlowChartFilter");
const { getRepository } = require("typeorm");


exports.getNode = async function(nodeSeq){
    const FlowChartRepository = getRepository(FlowChartEntity);
    const Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .where(`SEQ = ${nodeSeq}`)
                .andWhere(`DEL_YN = 'N'`)
                .leftJoinAndSelect("FLOWCHART.FILTER_INFO", "FILTER")
                .getOne();

    return Query
}

exports.getAllNode = async function(req, res){
    const FlowChartRepository = getRepository(FlowChartEntity);
    const Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .where(`DEL_YN = 'N'`)
                .leftJoinAndSelect("FLOWCHART.FILTER_INFO", "FILTER")
                .getMany();

    return Query;
}
exports.getRootNode = async function(req, res){
    const FlowChartRepository = getRepository(FlowChartEntity)
    const Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .where("P_SEQ = 0")
                .andWhere("DEL_YN ='N'")
                .getOne();

    return Query;
}
exports.getChildNode = async function(req, res){
    const FlowChartRepository = getRepository(FlowChartEntity)
    const Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .where(`P_SEQ = ${req.params.parentSeq}`)
                .andWhere("DEL_YN ='N'")
                .getMany();

    return Query;
}

exports.deleteNode = async function(nodeSeq){
    const FlowChartRepository = getRepository(FlowChartEntity)
    let Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .update()
                .set({ DEL_YN : `Y`})
                .where(`SEQ = ${nodeSeq}`)
                .execute()

    Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .update()
                .set({ DEL_YN : `Y`})
                .where(`P_SEQ = ${nodeSeq}`)
                .execute()

    const FlowChartFilterRepository = getRepository(FlowChartFilterEntity);
    let Query2 = await FlowChartFilterRepository.createQueryBuilder("FLOWCHART_FILTER")
                .update()
                .set({ DEL_YN : `Y`})
                .where(`N_SEQ = ${nodeSeq}`)
                .execute()

    return Query;
}

exports.saveNode = async function(data){
    const FlowChartRepository = getRepository(FlowChartEntity)
    let Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .insert()
                .values(data)
                .execute()
                
    return Query;
}

exports.modifyNode = async function(nodeSeq, data){
    const FlowChartRepository = getRepository(FlowChartEntity)
    let Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .update()
                .set(data)
                .where(`SEQ = ${nodeSeq}`)
                .execute()

    return Query;
}

exports.deleteFlowChart = async function(){
    const FlowChartRepository = getRepository(FlowChartEntity)
    let Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .delete()
                .execute();

    const FlowChartFilterRepository = getRepository(FlowChartFilterEntity);
    Query = await FlowChartFilterRepository.createQueryBuilder("FLOWCHART_FILTER")
                .delete()
                .execute();
    
    return Query;
}

exports.checkOverlapNode = async function(parentSeq, answerFlag){
    const FlowChartRepository = getRepository(FlowChartEntity)
    let Query = await FlowChartRepository.createQueryBuilder("FLOWCHART")
                .where(`P_SEQ = ${parentSeq}`)
                .andWhere(`ANSWER_FLAG = "${answerFlag}"`)
                .andWhere(`DEL_YN = 'N'`)
                .getOne();

    return Query;    
}

exports.insertFilter = async function(data){
    const FlowChartFilterRepository = getRepository(FlowChartFilterEntity);
    let Query = await FlowChartFilterRepository.createQueryBuilder("FLOWCHART_FILTER")
                .insert()
                .values(data)
                .execute();
    return Query;
}

exports.deleteFilters = async function(nodeSeq){
    const FlowChartFilterRepository = getRepository(FlowChartFilterEntity);
    let Query = await FlowChartFilterRepository.createQueryBuilder("FLOWCHART_FILTER")
                .delete()
                .where(`N_SEQ = ${nodeSeq}`)
                .execute();
    
    return Query;
}