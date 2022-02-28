const { EntitySchema } = require("typeorm");

export const ApplyAttachEntity = new EntitySchema({
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
})
module.exports = ApplyAttachEntity;



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
