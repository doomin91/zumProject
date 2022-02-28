"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TakeOverEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.TakeOverEntity = new EntitySchema({
    name: "TAKE_OVER",
    tableName: "TBL_FW_APPLY_TAKE_OVER",
    columns: {
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        APPLY_SEQ: {
            type: Number
        },
        FROM_USER_SEQ: {
            type: "int"
        },
        TO_USER_SEQ: {
            type: "int"
        },
        REG_DATE: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP",
            createDate: true
        },
        APPROVAL_FLAG: {
            type: "char",
            length: 1
        },
        APPROVAL_DATE: {
            type: "datetime",
        },
        DEL_YN: {
            type: "char",
            default: () => "N",
            length: 1
        }
    },
    relations: {
        FROM: {
            type: "many-to-one",
            target: "USER",
            inverseSide: "TAKE_OVER_FROM",
            joinColumn: { name: "FROM_USER_SEQ" }
        },
        TO: {
            type: "many-to-one",
            target: "USER",
            inverseSide: "TAKE_OVER_TO",
            joinColumn: { name: "TO_USER_SEQ" }
        }
    }
});
module.exports = exports.TakeOverEntity;
//# sourceMappingURL=TakeOver.js.map