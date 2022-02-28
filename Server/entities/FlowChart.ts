const { EntitySchema } = require("typeorm");

export const FlowChartEntity = new EntitySchema({
    name: "FLOWCHART",
    tableName: "TBL_FW_FLOWCHART",
    columns:{
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        P_SEQ: {
            type: "int"
        },
        TYPE: {
            type: "char"
        },
        ADMIN_MEMO: {
            type: "varchar"
        },
        USER_MEMO: {
            type: "varchar"
        },
        ANSWER_FLAG: {
            type: "char",
            length: 1
        },
        DEL_YN: {
            type: "char",
            length: 1
        },
        REG_DATE: {
            type: "datetime"
        },
        WORK_FLAG: {
            type: "char",
            length: 1
        }
    },
    relations: {
        FILTER_INFO: {
            type: "one-to-many",
            target: "FLOWCHART_FILTER",
            inverseSide: "FLOWCHART_INFO"
        }
    }
})

module.exports = FlowChartEntity
