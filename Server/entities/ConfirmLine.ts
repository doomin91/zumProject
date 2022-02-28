const { EntitySchema } = require("typeorm");

export const ConfirmLineEntity = new EntitySchema({
    name: "CONFIRM_LINE",
    tableName: "TBL_FW_CONFIRM_LINE",
    columns:{
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        USER_SEQ: {
            type: "int"
        },
        LINE_TITLE: {
            type: "varchar"
        },
        CONFIRM_LINE_DATA: {
            type: "text"
        }
    },
    relations: {
         USER_INFO: {
            type: "many-to-one",
            target: "USER",
            inverseSide: "CONFIRM_LINE",
            joinColumn: { name: "USER_SEQ" }
        }
    }
})

module.exports = ConfirmLineEntity