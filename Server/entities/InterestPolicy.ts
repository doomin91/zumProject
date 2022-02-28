const { EntitySchema } = require("typeorm");

export const InterestPolicyEntity = new EntitySchema({
    name: "INTEREST_POLICY",
    tableName: "TBL_FW_INTEREST_POLICY",
    columns:{
        IP_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        IP_TITLE: {
            type: Number,
        },
        IP_CONTENT: {
            type: "text"
        },
        POLICY_DATA: {
            type: String
        },
        START_DATETIME: {
            type: "datetime"
        },
        END_DATETIME: {
            type: "datetime"
        },
        DOMAIN_ID: {
            type: "int"
        },
        DEVICE_ID: {
            type: "int"
        },
        ALERT_MAIL: {
            type: Number
        },
        CREATE_USER: {
            type: "int"
        },
        DEL_YN: {
            type: "char",
            lenght: 1
        },
        IP_STATUS: {
            type: "char",
            lenght: 1
        },
        CREATE_DATE: {
            type: "timestamp"
        }
    },
    relations: {
        DEVICE_INFO: {
            type: "many-to-one",
            target: "DEVICE",
            inverseSide: "INTEREST_POLICY_INFO",
            joinColumn: { 
                name: "DEVICE_ID", 
                referenceColumName: "DEVICE_ID"
            }
        }
    }
})

module.exports = InterestPolicyEntity
