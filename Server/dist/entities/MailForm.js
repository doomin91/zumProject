"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailFormEntity = void 0;
const { EntitySchema } = require("typeorm");
exports.MailFormEntity = new EntitySchema({
    name: "MAIL_FORM",
    tableName: "TBL_FW_MAILFORM",
    columns: {
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        MAIL_TITLE: {
            type: Number,
        },
        MAIL_CONTENTS: {
            type: "text"
        },
        LAST_REG_DATE: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP",
            updateDate: true
        },
        LAST_REG_USER: {
            type: "int"
        }
    }
});
module.exports = exports.MailFormEntity;
//# sourceMappingURL=MailForm.js.map