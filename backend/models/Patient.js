const mongoose = require("mongoose");
const { string } = require("zod");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  description : { type: String, required: true },
  tokenNumber: { type: Number, required: true },
  status: {
    type: String,
    enum: ["waiting", "completed", "cancelled"],
    default: "waiting"
  },
  number : {type : String, required: true},
  uniqueLinkId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

module.exports = mongoose.model("Patient", patientSchema);
