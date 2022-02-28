"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterestPolicySummaryEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.InterestPolicySummaryEntity = new EntitySchema({
    name: "INTEREST_POLICY_SUMMARY",
    tableName: "TBL_FW_INTEREST_POLICY_SUMMARY",
    columns: {
        IPS_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        PARENT_IP_SEQ: {
            type: "int"
        },
        POLICY_NUMBER: {
            type: Number
        },
        LOG_DATE: {
            type: "datetime"
        },
        ALLOW_COUNT: {
            type: "int"
        },
        ALLOW_SEND_BYTE: {
            type: "int"
        },
        ALLOW_RECV_BYTE: {
            type: "int"
        },
        DROP_COUNT: {
            type: "int"
        },
        DROP_SEND_BYTE: {
            type: "int"
        },
        DROP_RECV_BYTE: {
            type: "int"
        },
    },
});
module.exports = exports.InterestPolicySummaryEntity;
//# sourceMappingURL=InterestPolicySummary.js.map