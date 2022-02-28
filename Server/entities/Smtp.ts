const { EntitySchema } = require("typeorm");

export const SmtpEntity = new EntitySchema({
    name: "SMTP",
    tableName: "TBL_FW_SETTING_SMTP",
    columns:{
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        SMTP_USER_FLAG: {
            type: "char",
            length: 1
        },
        SMTP_AUTH_FLAG: {
            type: "char",
            length: 1
        },
        SMTP_TLS_FLAG: {
            type: "char",
            length: 1
        },
        SMTP_HOST: {
            type: String
        },
        SMTP_PORT: {
            type: Number
        },
        SMTP_USER: {
            type: String
        },
        SMTP_PASS: {
            type: String
        },
        SMTP_PROTOCOL: {
            type: String
        },
        SMTP_ENCODING: {
            type: String
        },
        SMTP_MAIL_ADDR: {
            type: String
        }
    }
})

module.exports = SmtpEntity