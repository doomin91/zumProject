"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyConfirmEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.ApplyConfirmEntity = new EntitySchema({
    name: "CONFIRM",
    tableName: "TBL_FW_APPLY_CONFIRM",
    columns: {
        CONFIRM_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        APPLY_SEQ: {
            type: "int"
        },
        CONFIRM_FLAG: {
            type: "int"
        },
        CONFIRM_ORDER: {
            type: "int"
        },
        CONFIRM_STATUS: {
            type: "varchar",
            length: 1
        },
        CONFIRM_MEMO: {
            type: "varchar",
            length: 500
        },
        CONFIRM_DATE: {
            type: "timestamp"
        },
        CONFIRM_USER_SEQ: {
            type: "int"
        },
        CONFIRM_USER_NAME: {
            type: "varchar",
            length: 50
        },
        CONFIRM_USER_POSITION: {
            type: "varchar",
            length: 50
        },
        CONFIRM_USER_POSITION_SEQ: {
            type: "int"
        },
        CONFIRM_USER_DEPARTMENT: {
            type: "varchar",
            length: 50
        },
        CONFIRM_USER_DEPARTMENT_SEQ: {
            type: "int"
        }
    },
    relations: {
        APPLY: {
            type: "many-to-one",
            target: "APPLY",
            invserseSide: "CONFIRMS",
            joinColumn: {
                name: "APPLY_SEQ",
            }
        }
    }
});
module.exports = exports.ApplyConfirmEntity;
//# sourceMappingURL=ApplyConfirm.js.map