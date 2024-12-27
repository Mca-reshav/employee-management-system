const mongoose = require("mongoose");
const { validDept, createdBy } = require("../services/constants.sv");

const empSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        empName: {
            type: String,
            required: false,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
        },
        contactNo: {
            type: String,
            required: false,
            unique: true
        },
        dept: {
            type: String,
            enum: Object.keys(validDept),
            required: false,
        },
        doj: {
            type: Date,
            required: false,
        },
        createdBy: {
            type:String,
            required:true,
            enum: Object.values(createdBy),
            default: createdBy.SELF
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

exports.EmpEMS = mongoose.model("EmpEMS", empSchema);