const { EntitySchema } = require("typeorm");

export const ApplyConfirmEntity = new EntitySchema({
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
})
module.exports = ApplyConfirmEntity;



// bit
// int
// integer
// tinyint
// smallint
// mediumint
// bigint
// float
// double
// doubleprecision
// dec
// decimal
// numeric
// fixed
// bool
// boolean
// date
// datetime
// timestamp
// time
// year
// char
// nchar
// nationalchar
// varchar
// nvarchar
// nationalvarchar
// text
// tinytext
// mediumtext
// blob
// longtext
// tinyblob
// mediumblob
// longblob
// enum
// set
// json
// binary
// varbinary
// geometry
// point
// linestring
// polygon
// multipoint
// multilinestring
// multipolygon
// geometrycollection
