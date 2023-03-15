const mongoose = require("mongoose");
var path = require("path");

const coverImageStorePath = "uploads/bookCovers";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  publishDate: { type: Date, required: true },
  pageCount: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  coverImageName: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "authors",
  },
  // author: {
  //   type: String,
  //   required: true,
  //   // ref: "authors",
  // },
});

//! VIRTUAL PROPERTY TO GET THE PATH IT WILL ACT AS ABOVE ANY OTHER DATA VARIABLE THAT WE CREATED ABOVE.
//* IT WILL HELP TO GET THE PATH OF THE COVER PAGE WITH THE NAME
bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", coverImageStorePath, this.coverImageName);
  }
});

module.exports = mongoose.model("books", bookSchema);
module.exports.coverImageStorePath = coverImageStorePath;
