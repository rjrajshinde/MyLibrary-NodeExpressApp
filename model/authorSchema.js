const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, unique: true , required: true},
  contact: { type: String, required: true }
});

module.exports = mongoose.model("authors", authorSchema);
