const { EntitySchema } = require("typeorm");

export const ApplyRuleBackUpEntity = new EntitySchema({
    name: "APPLY_RULE_BACKUP",
    tableName: "TBL_FW_APPLY_RULE_BACKUP",
    columns: {
        BACKUP_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        APPLY_SEQ: {
            type: "int"
        },
        SEQ: {
            type: "int",
        },
        REVERSE_FLAG: {
            type: "char",
            length: 1
        },
        SOURCE: {
            type: "varchar",
            length: 3000
        },
        DESTINATION: {
            type: "varchar",
            length: 3000
        },
        SERVICE: {
            type: "varchar",
            length: 3000
        },
        EXPIRATION_DATE: {
            type: "date"
        },
        DESCRIPTION: {
            type: "varchar",
            length: 200
        },
        STATUS: {
            type: "char",
            length: 1
        },
    },
})

module.exports = ApplyRuleBackUpEntity;