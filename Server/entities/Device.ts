const { EntitySchema } = require("typeorm");

export const DeviceEntity = new EntitySchema({
    name: "DEVICE",
    tableName: "TBL_FW_DEVICE_INFO",
    columns:{
        DEVICE_SEQ: {
            type: "int",
            primary: true,
            generated: true
        },
        DEVICE_ID: {
            type: "int"
        },
        DOMAIN_ID: {
            type: "int"
        },
        DEVICE_NAME: {
            type: String
        },
        DEVICE_IP: {
            type: String
        },
        DEVICE_VENDOR: {
            type: String
        },
        REG_DATE: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP",
            createDate: true
        },
        DEVICE_CHANGE_LOG: {
            type: String,
            length: 500
        },
        USER_ID: {
            type: "varchar"
        },
        PASSWORD: {
            type: "varchar"
        },
        PROTOCOL: {
            type: "varchar"
        },
        PORT: {
            type: "varchar"
        },
        RETRIEVAL_FLAG: {
            type: "char",
            length: 1
        },
        CHANGE_FLAG: {
            type: "char",
            length: 1
        },
        LOG_FLAG: {
            type: "char",
            length: 1
        }
    },
    relations: {
        INTEREST_POLICY_INFO: {
            type: "one-to-many",
            target: "INTEREST_POLICY",
            inverseSide: "DEVICE_INFO",
        },
    }
    
})

module.exports = DeviceEntity