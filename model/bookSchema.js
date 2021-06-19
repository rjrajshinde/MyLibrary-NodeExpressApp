const mongoose = require("mongoose");

const coverImageStorePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
  title:{ type: String, required: true},
  description: { type: String, required: true},
  publishDate: { type: Date, required: true},
  pageCount: {type: Number, required: true},
  createdAt: {type: Date, required: true, default: Date.now},
  coverImageName: {type: String, required: true},
  author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'authors'}
});

module.exports = mongoose.model("books", bookSchema);
module.exports.coverImageStorePath = coverImageStorePath;