"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyNatRuleBackUpEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.ApplyNatRuleBackUpEntity = new EntitySchema({
    name: "APPLY_NAT_RULE_BACKUP",
    tableName: "TBL_FW_APPLY_NAT_RULE_BACKUP",
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
        }
    }
});
module.exports = exports.ApplyNatRuleBackUpEntity;
//# sourceMappingURL=ApplyNatRuleBackUp.js.map