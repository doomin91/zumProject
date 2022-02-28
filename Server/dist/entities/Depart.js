"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.DepartEntity = new EntitySchema({
    name: "DEPART",
    tableName: "TBL_FW_DEPARTMENT",
    columns: {
        DEPARTMENT_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        PARENT_DEPARTMENT_SEQ: {
            type: "int"
        },
        REF: {
            type: "int"
        },
        DEPTH: {
            type: "char"
        },
        DEPARTMENT: {
            type: "varchar"
        },
        DEPARTMENT_CODE: {
            type: "varchar"
        },
        DEPARTMENT_DEL_YN: {
            type: "char",
            legnth: 1
        },
        DEPARTMENT_TEL: {
            type: "varchar",
            legnth: 20
        },
        PID: {
            type: "int",
        }
    },
    relations: {
        USER_INFO: {
            type: "one-to-many",
            target: "USER",
            inverseSide: "DEPART_INFO",
        }
    }
});
module.exports = exports.DepartEntity;
//# sourceMappingURL=Depart.js.map