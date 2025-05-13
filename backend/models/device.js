const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["online", "offline"], default: "offline" },
  registered_at: { type: Date, default: Date.now },
  location: { type: Object, default: {} },
  current_value: {type: String, default: "0.0"},
  history:
  [
    {
      value: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Device", DeviceSchema);
