const { EntitySchema } = require("typeorm");

export const FlowChartFilterEntity = new EntitySchema({
    name: "FLOWCHART_FILTER",
    tableName: "TBL_FW_FLOWCHART_FILTER",
    columns:{
        FILTER_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        N_SEQ: {
            type: "int"
        },
        FILTER_TYPE: {
            type: "varchar"
        },
        FILTER_GROUP_CONDITION: {
            type: "varchar"
        },
        FILTER_CONDITION: {
            type: "varchar"
        },
        FILTER_CONTENTS: {
            type: "char",
            length: 1
        },
        FILTER_DEL_YN: {
            type: "char",
            length: 1
        }
    },
    relations: {
        FLOWCHART_INFO: {
            type: "many-to-one",
            target: "FLOWCHART",
            inverseSide: "FILTER_INFO",
            joinColumn: { name : "N_SEQ" }
        }
    }
})

module.exports = FlowChartFilterEntity
