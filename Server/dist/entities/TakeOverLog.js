"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TakeOverLogEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.TakeOverLogEntity = new EntitySchema({
    name: "TAKE_OVER_LOG",
    tableName: "TBL_FW_APPLY_TAKE_OVER_LOG",
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
        }
    },
    relations: {
        FROM: {
            type: "many-to-one",
            target: "USER",
            inverseSide: "TAKE_OVER_FROM_LOG",
            joinColumn: { name: "FROM_USER_SEQ" }
        },
        TO: {
            type: "many-to-one",
            target: "USER",
            inverseSide: "TAKE_OVER_TO_LOG",
            joinColumn: { name: "TO_USER_SEQ" }
        }
    }
});
module.exports = exports.TakeOverLogEntity;
//# sourceMappingURL=TakeOverLog.js.map