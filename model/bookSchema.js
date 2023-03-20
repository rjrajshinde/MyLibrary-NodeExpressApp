const mongoose = require("mongoose");
var path = require("path");

const coverImageStorePath = "uploads/bookCovers";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  publishDate: { type: Date, required: true },
  pageCount: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  coverImage: { type: Buffer, required: true },
  coverImageType: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "authors",
  },
  authorName: { type: String, required: true },
  // author: {
  //   type: String,
  //   required: true,
  //   // ref: "authors",
  // },
});

//! VIRTUAL PROPERTY TO GET THE PATH IT WILL ACT AS ABOVE ANY OTHER DATA VARIABLE THAT WE CREATED ABOVE.
//* IT WILL HELP TO GET THE PATH OF THE COVER PAGE WITH THE NAME
// bookSchema.virtual("coverImagePath").get(function () {
//   if (this.coverImageName != null) {
//     return path.join("/", coverImageStorePath, this.coverImageName);
//   }
// });
bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    //TODO IT IS CALLED DATA OBJECT. IT IS USED AS A SOURCE FOR IMAGES ALLOWS US TO TAKE BUFFER DATA ESSENTIALLY AND USE THAT AS THE ACTUAL SOURCE FOR A IMAGE
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

module.exports = mongoose.model("books", bookSchema);
module.exports.coverImageStorePath = coverImageStorePath;
