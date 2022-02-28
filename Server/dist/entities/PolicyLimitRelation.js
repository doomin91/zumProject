"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyLimitRelationEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.PolicyLimitRelationEntity = new EntitySchema({
    name: "POLICY_LIMIT_RELATION",
    tableName: "TBL_FW_POLICY_LIMIT_RELATION",
    columns: {
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        ADMIN_SEQ: {
            type: "int"
        },
        LIMIT_SEQ: {
            type: "int"
        },
        START_DATE: {
            type: "datetime"
        },
        END_DATE: {
            type: "datetime"
        },
        DEL_YN: {
            type: "char",
            length: 1
        }
    },
    relations: {
        LIMIT: {
            type: "many-to-one",
            target: "POLICY_LIMIT",
            inverseSide: "RELATION",
            joinColumn: { name: "LIMIT_SEQ" }
        },
        USER_INFO: {
            type: "many-to-one",
            target: "USER",
            inverseSide: "RELATION",
            joinColumn: { name: "ADMIN_SEQ" }
        }
    }
});
module.exports = exports.PolicyLimitRelationEntity;
//# sourceMappingURL=PolicyLimitRelation.js.map