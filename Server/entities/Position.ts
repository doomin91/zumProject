const { EntitySchema } = require("typeorm");

export const PositionEntity = new EntitySchema({
    name: "POSITION",
    tableName: "TBL_FW_CODE",
    columns:{
        CODE_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        CODE_NAME: {
            type: "varchar"
        },
        CODE_PART: {
            type: "varchar"
        },
        CODE_ORDER: {
            type: "int",
        },
        CODE_KEY: {
            type: "int",
        }
    },
    relations: {
         USER_INFO: {
            type: "one-to-many",
            target: "USER",
            inverseSide: "POSITION_INFO",
        }
    }
})

module.exports = PositionEntity