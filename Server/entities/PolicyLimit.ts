const { EntitySchema } = require("typeorm");

export const PolicyLimitEntity = new EntitySchema({
    name: "POLICY_LIMIT",
    tableName: "TBL_FW_POLICY_LIMIT",
    columns:{
        LIMIT_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        LIMIT_TITLE: {
            type: String
        },
        LIMIT_DEFAULT_FLAG: {
            type: "char",
            length: 1
        },
        LIMIT_APPLY: {
            type: String
        },
        LIMIT_APPLY_RULE: {
            type: String
        },
        LIMIT_RULE: {
            type: String
        },
        LIMIT_PERIOD_FLAG: {
            type: "char",
            length: 1
        },
        LIMIT_REG_DATE: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP",
            createDate: true
        },
        LIMIT_DEL_YN: {
            type: "char",
            default: () => "N",
            length: 1
        }
    },
    relations: {
        RELATION: {
            type: "one-to-many",
            target: "POLICY_LIMIT_RELATION",
            inverseSide: "LIMIT"
        }
    }
})

module.exports = PolicyLimitEntity