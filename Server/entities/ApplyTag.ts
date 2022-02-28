const { EntitySchema } = require("typeorm");

export const ApplyTag = new EntitySchema({
    name: "TAG",
    tableName: "TBL_FW_APPLY_TAG",
    columns: {
        SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        APPLY_SEQ: {
            type: "int"
        },
        TAG: {
            type: "varchar",
            length: 50
        }
    },
    relations: {
        APPLY: {
            type: "many-to-one",
            target: "APPLY",
            invserseSide: "TAGS",
            joinColumn: {
                name: "APPLY_SEQ",
            }
            
        }
    }
})
module.exports = ApplyTag;
