const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      unique: true,
      trim: true,
    },
    description: { type: String, trim: true, default: "" },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Department", departmentSchema);
