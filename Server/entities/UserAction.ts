const { EntitySchema } = require("typeorm");

export const UserActionEntity = new EntitySchema({
    name: "USER_ACTION",
    tableName: "TBL_FW_USER_ACTION",
    columns:{
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
        USER: { // relation alias
            type: "many-to-one", // 1:1 1:다 m:n
            target: "USER",  // 연결하려는 entity의 name
            inverseSide: "ACTIONS", // 연결하려는 name의 relation alias
            joinColumn: { name : "USER_SEQ"} // 자동 생성하려는 외래키 이름
        }
    }
})

module.exports = UserActionEntity