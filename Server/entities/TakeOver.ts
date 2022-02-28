const { EntitySchema } = require("typeorm");

export const TakeOverEntity = new EntitySchema({
    name: "TAKE_OVER",
    tableName: "TBL_FW_APPLY_TAKE_OVER",
    columns:{
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
        FROM: { // relation alias
            type: "many-to-one", // 1:1 1:다 m:n
            target: "USER",  // 연결하려는 entity의 name
            inverseSide: "TAKE_OVER_FROM", // 연결하려는 name의 relation alias
            joinColumn: { name : "FROM_USER_SEQ"} // 자동 생성하려는 외래키 이름
        },
        TO: {
            type: "many-to-one", // 1:1 1:다 m:n
            target: "USER",  // 연결하려는 entity의 name
            inverseSide: "TAKE_OVER_TO", // 연결하려는 name의 relation alias
            joinColumn: { name : "TO_USER_SEQ"} // 자동 생성하려는 외래키 이름
        }
    }
})

module.exports = TakeOverEntity