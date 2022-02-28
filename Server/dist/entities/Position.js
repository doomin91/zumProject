"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.PositionEntity = new EntitySchema({
    name: "POSITION",
    tableName: "TBL_FW_CODE",
    columns: {
        CODE_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        CODE_NAME: {
            type: "varchar"
        },
        CODE_PART: {
            type: "varchar"
        },
        CODE_ORDER: {
            type: "int",
        },
        CODE_KEY: {
            type: "int",
        }
    },
    relations: {
        USER_INFO: {
            type: "one-to-many",
            target: "USER",
            inverseSide: "POSITION_INFO",
        }
    }
});
module.exports = exports.PositionEntity;
//# sourceMappingURL=Position.js.map