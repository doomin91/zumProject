const { EntitySchema } = require("typeorm");

export const MailFormEntity = new EntitySchema({
    name: "MAIL_FORM",
    tableName: "TBL_FW_MAILFORM",
    columns:{
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        MAIL_TITLE: {
            type: Number,
        },
        MAIL_CONTENTS: {
            type: "text"
        },
        LAST_REG_DATE: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP",
            updateDate: true
        },
        LAST_REG_USER: {
            type: "int"
        }
    }
})

module.exports = MailFormEntity
