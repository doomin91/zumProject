const { EntitySchema } = require("typeorm");

export const TakeOverLogEntity = new EntitySchema({
    name: "TAKE_OVER_LOG",
    tableName: "TBL_FW_APPLY_TAKE_OVER_LOG",
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
        }
    },
    relations: {
        FROM: { // relation alias
            type: "many-to-one", // 1:1 1:다 m:n
            target: "USER",  // 연결하려는 entity의 name
            inverseSide: "TAKE_OVER_FROM_LOG", // 연결하려는 name의 relation alias
            joinColumn: { name : "FROM_USER_SEQ"} // 자동 생성하려는 외래키 이름
        },
        TO: {
            type: "many-to-one", // 1:1 1:다 m:n
            target: "USER",  // 연결하려는 entity의 name
            inverseSide: "TAKE_OVER_TO_LOG", // 연결하려는 name의 relation alias
            joinColumn: { name : "TO_USER_SEQ"} // 자동 생성하려는 외래키 이름
        }
    }
})

module.exports = TakeOverLogEntity