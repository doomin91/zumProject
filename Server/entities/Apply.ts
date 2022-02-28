const { EntitySchema } = require("typeorm");

export const ApplyEntity = new EntitySchema({
    name: "APPLY",
    tableName: "TBL_FW_APPLY",
    columns: {
        APPLY_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        USER_SEQ: {
            type: "int"
        },
        COPY_APPLY_SEQ: {
            type: "int"
        },
        APPLY_NUMBER: {
            type: "varchar",
            length: 50
        },
        APPLY_TITLE: {
            type: String
        },
        APPLY_STATUS: {
            type: String
        },
        APPLY_DEL_YN: {
            type: String
        },
        APPLY_REG_DATE: {
            type: "datetime"
        },
        APPLY_COMPLETE_DATE: {
            type: String
        },
        APPLY_LAST_ACTION:{
            type: String
        },
        APPLY_ACTION_DATE: {
            type: String
        },
        ADMIN_MODIFY_FLAG: {
            type: String
        },
        ADMIN_TITLE: {
            type: String
        },
        APPLY_CONFIRM_ORDER: {
            type: String
        },
        RECEPTION_CONFIRM_ORDER: {
            type: String
        },
        PLANNING_CONFIRM_ORDER: {
            type: String
        },
        APPLY_USER_NAME: {
            type: String
        },
        APPLY_USER_POSITION: {
            type: String
        },
        APPLY_USER_POSITION_SEQ: {
            type: String
        },
        APPLY_USER_DEPARTMENT: {
            type: String
        },
        APPLY_USER_DEPARTMENT_SEQ: {
            type: String
        },
        APPLY_PLANNING_USER_SEQ: {
            type: String
        },
        APPLY_PLANNING_USER_NAME: {
            type: String
        },
        APPLY_PLANNING_USER_POSITION: {
            type: String
        },
        APPLY_PALNNING_USER_POSITION_SEQ: {
            type: String
        },
        APPLY_PALNNING_USER_DEPARTMENT: {
            type: String
        },
        APPLY_PALNNING_USER_DEPARTMENT_SEQ: {
            type: String
        },
        APPLY_PLANNING_MEMO: {
            type: String
        },
        APPLY_PLANNING_DATE: {
            type: String
        },
        APPLY_PLANNING_FLAG: {
            type: String
        },
        APPLY_RECEPT_USER_SEQ: {
            type: String
        },
        APPLY_RECEPT_USER_NAME: {
            type: String
        },
        APPLY_RECEPT_USER_POSITION: {
            type: String
        },
        APPLY_RECEPT_USER_POSITION_SEQ: {
            type: String
        },
        APPLY_RECEPT_USER_DEPARTMENT: {
            type: String
        },
        APPLY_RECEPT_USER_DEPARTMENT_SEQ: {
            type: String
        },
        APPLY_WORK_TYPE: {
            type: String
        },
        APPLY_RECEPT_MEMO: {
            type: String
        },
        APPLY_RECEPT_FLAG: {
            type: String
        },
        APPLY_RECEPT_REG_DATE: {
            type: String
        },
        APPLY_RECEPT_COMPLETED_DATE: {
            type: String
        },
        APPLY_WORK_USER_SEQ: {
            type: String
        },
        APPLY_WORK_USER_NAME: {
            type: String
        },
        APPLY_WORK_USER_POSITION: {
            type: String
        },
        APPLY_WORK_USER_POSITION_SEQ: {
            type: String
        },
        APPLY_WORK_USER_DEPARTMENT: {
            type: String
        },
        APPLY_WORK_USER_DEPARTMENT_SEQ: {
            type: String
        },
        APPLY_WORK_MEMO: {
            type: String
        },
        APPLY_WORK_FLAG: {
            type: String
        },
        APPLY_WORK_DATE: {
            type: String
        }
    },
    relations: {
        CONFIRMS: {
            type: "one-to-many",
            target: "CONFIRM",
            inverseSide: "APPLY",
        },
        ATTACHES: {
            type: "one-to-many",
            target: "APPLY_ATTACH",
            inverseSide: "APPLY",
        },
        RULES: {
            type: "one-to-many",
            target: "APPLY_RULE",
            inverseSide: "APPLY",
        },
        NAT_RULES: {
            type: "one-to-many",
            target: "APPLY_NAT_RULE",
            inverseSide: "APPLY",
        },
        TAGS: {
            type: "one-to-many",
            target: "TAG",
            inverseSide: "APPLY",
        }
    }
})
module.exports = ApplyEntity;




