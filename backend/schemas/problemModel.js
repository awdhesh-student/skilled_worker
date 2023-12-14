const mongoose = require("mongoose");

const problemModel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    state: {
      type: String,
      required: [true, "state is required"],
    },
    pincode: {
      type: Number,
      required: [true, "pincode is required"],
    },
    phone: {
      type: Number,
      required: [true, "phone number is required"],
    },
    comment: {
      type: String,
      maxLength: 1000,
    },
    file: {
      type: Object,
    },
    status: {
      type: String,
      default: "pending",
    },
    assigned: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const problemSchema = mongoose.model("problem", problemModel);

module.exports = problemSchema;
