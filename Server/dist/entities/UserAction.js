"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActionEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.UserActionEntity = new EntitySchema({
    name: "USER_ACTION",
    tableName: "TBL_FW_USER_ACTION",
    columns: {
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        USER_SEQ: {
            type: "int"
        },
        USER_ACTION_TABLE: {
            type: "varchar",
            legnth: 50
        },
        USER_ACTION_FUNCTION: {
            type: "varchar",
            legnth: 50
        },
        USER_ACTION_RESULT: {
            type: "varchar",
            legnth: 50
        },
        USER_ACTION_DATE: {
            type: 'timestamp',
            default: () => "CURRENT_TIMESTAMP",
            createDate: true
        }
    },
    relations: {
        USER: {
            type: "many-to-one",
            target: "USER",
            inverseSide: "ACTIONS",
            joinColumn: { name: "USER_SEQ" }
        }
    }
});
module.exports = exports.UserActionEntity;
//# sourceMappingURL=UserAction.js.map