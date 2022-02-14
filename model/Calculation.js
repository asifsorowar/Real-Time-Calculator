const mongoose = require("mongoose");

const calculationSchema = new mongoose.Schema(
  {
    file: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    result: {
      type: String,
      default: "",
    },
    created: String,
  },
  { timestamps: true }
);

const Calculation = mongoose.model("Calculation", calculationSchema);

module.exports.Calculation = Calculation;
