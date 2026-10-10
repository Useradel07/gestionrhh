const mongoose = require("mongoose");
const absenceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "L'employé est obligatoire"],
    },
    date: { type: Date, required: [true, "La date est obligatoire"] },
    type: {
      type: String,
      enum: ["Absence", "Retard", "Départ anticipé", "Télétravail"],
      required: true,
      default: "Absence",
    },
    motif: { type: String, trim: true, default: "" },
    justifiee: { type: Boolean, default: false },
    heureArrivee: { type: String, default: "" },
    heureDepart: { type: String, default: "" },
    retardMinutes: { type: Number, min: 0, default: 0 },
    commentaire: { type: String, trim: true, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Absence", absenceSchema);
