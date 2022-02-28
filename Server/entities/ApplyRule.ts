const { EntitySchema } = require("typeorm");

export const ApplyRuleEntity = new EntitySchema({
    name: "APPLY_RULE",
    tableName: "TBL_FW_APPLY_RULE",
    columns: {
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        APPLY_SEQ: {
            type: "int"
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
        DEL_YN: {
            type: "char",
            length: 1,
            default: 'N'
        },
        ADMIN_FLAG: {
            type: "char",
            length: 1
        },
        CHANGE_ITEMS: {
            type: "varchar",
            length: 100
        }
    },
    relations: {
        APPLY: {
            type: "many-to-one",
            target: "APPLY",
            invserseSide: "RULES",
            joinColumn: {
                name: "APPLY_SEQ",
            }
            
        }
    }
})

module.exports = ApplyRuleEntity;