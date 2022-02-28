"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.UserEntity = new EntitySchema({
    name: "USER",
    tableName: "TBL_FW_USER",
    columns: {
        USER_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        USER_DEPARTMENT: {
            type: "int"
        },
        USER_STATUS: {
            type: "int"
        },
        USER_AUTH: {
            type: "char"
        },
        USER_DEL_YN: {
            type: "char"
        },
        USER_RETIRE_YN: {
            type: "char"
        },
        USER_ID: {
            type: "varchar",
            legnth: 255
        },
        USER_NAME: {
            type: "varchar",
            legnth: 255
        },
        USER_PHONE: {
            type: "varchar",
            legnth: 255
        },
        USER_EMAIL: {
            type: "varchar",
            legnth: 255
        },
        USER_REG_DATE: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            createDate: true
        },
        USER_OBJECT_AUTH: {
            type: "char",
            nullable: true
        },
        USER_SYSTEM_AUTH: {
            type: "char",
            nullable: true
        },
        USER_NETWORK_AUTH: {
            type: "char",
            nullable: true
        },
        USER_PASS: {
            type: "varchar",
        },
        USER_RULE_AUTH: {
            type: "char"
        },
        USER_POSITION: {
            type: "varchar"
        },
        USER_COMPANY_ID: {
            type: "varchar"
        },
        USER_AUTH_REFRESH_TOKEN: {
            type: "varchar"
        }
    },
    relations: {
        DEPART_INFO: {
            type: "many-to-one",
            target: "DEPART",
            inverseSide: "USER_INFO",
            joinColumn: { name: "USER_DEPARTMENT" }
        },
        POSITION_INFO: {
            type: "many-to-one",
            target: "POSITION",
            inverseSide: "USER_INFO",
            joinColumn: { name: "USER_POSITION" }
        },
        TAKE_OVER_FROM: {
            type: "one-to-many",
            target: "TAKE_OVER",
            inverseSide: "FROM",
        },
        TAKE_OVER_TO: {
            type: "one-to-many",
            target: "TAKE_OVER",
            inverseSide: "TO",
        },
        TAKE_OVER_FROM_LOG: {
            type: "one-to-many",
            target: "TAKE_OVER_LOG",
            inverseSide: "FROM",
        },
        TAKE_OVER_TO_LOG: {
            type: "one-to-many",
            target: "TAKE_OVER_LOG",
            inverseSide: "TO",
        },
        RELATION: {
            type: "one-to-many",
            target: "POLICY_LIMIT_RELATION",
            inverseSide: "USER_INFO",
        },
        ACTIONS: {
            type: "one-to-many",
            target: "USER_ACTION",
            inverseSide: "USER"
        },
        CONFIRM_LINE: {
            type: "one-to-many",
            target: "CONFIRM_LINE",
            inverseSide: "USER_INFO"
        }
    }
});
module.exports = exports.UserEntity;
//# sourceMappingURL=User.js.map