"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyAttachEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.ApplyAttachEntity = new EntitySchema({
    name: "APPLY_ATTACH",
    tableName: "TBL_FW_APPLY_ATTACH",
    columns: {
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        APPLY_SEQ: {
            type: "int"
        },
        APPLY_NUMBER: {
            type: "varchar",
            length: 50
        },
        FILE_NAME: {
            type: "varchar",
            length: 200
        },
        FILE_PATH: {
            type: "varchar",
            length: 500
        },
    },
    relations: {
        APPLY: {
            type: "many-to-one",
            target: "APPLY",
            invserseSide: "ATTACHES",
            joinColumn: {
                name: "APPLY_SEQ",
            }
        }
    }
});
module.exports = exports.ApplyAttachEntity;
//# sourceMappingURL=ApplyAttach.js.map