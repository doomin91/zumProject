"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyNatRuleEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.ApplyNatRuleEntity = new EntitySchema({
    name: "APPLY_NAT_RULE",
    tableName: "TBL_FW_APPLY_NAT_RULE",
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
        T_SOURCE: {
            type: "varchar",
            length: 3000
        },
        T_DESTINATION: {
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
            invserseSide: "NAT_RULES",
            joinColumn: {
                name: "APPLY_SEQ",
            }
        }
    }
});
module.exports = exports.ApplyNatRuleEntity;
//# sourceMappingURL=ApplyNatRule.js.map