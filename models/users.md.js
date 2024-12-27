const { mongoose } = require("../database/mongo.conn");
const { currentStatus } = require("../services/constants.sv");

exports.roleDesc = Object.freeze({
    '1': 'Admin',
    '2': 'Manager',
    '3': 'Employee'
});

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: Object.keys(this.roleDesc),
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(currentStatus),
            default: currentStatus.ACTIVE
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

exports.UserEMS = mongoose.model("UserEMS", userSchema);
