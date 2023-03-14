const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bookSchema = require("../model/bookSchema");
const authorSchema = require("../model/authorSchema");
const uploadPath = path.join("public", bookSchema.coverImageStorePath);
const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "images/gif"];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

//route to get all books
// router.get("/", async (req, res) => {
//   res.render("books/index");
// });

router.get("/", async (req, res) => {
  try {
    let data = await bookSchema.find();
    // data.forEach(async (ele) => {
    //   let authorID = ele.author;
    //   let authorName = await authorSchema.findById(authorID);
    //   console.log(ele.author);
    //   console.log("------------");
    //   ele.author = authorName;
    //   console.log(ele.author);
    //   console.log(";;;;;;;;;;;;;;;;;;;;;;;;;");
    //   console.log(ele);
    //   // console.log(
    //   //   "----------------",
    //   //   authorID,
    //   //   "----------------",
    //   //   authorName.name
    //   // );
    // });
    // data.forEach(async (ele) => {
    //   let authorID = ele.author;
    //   let authorName = await authorSchema.findById(authorID);
    //   ele[author] = authorName;
    //   console.log(
    //     "----------------",
    //     authorID,
    //     "----------------",
    //     authorName.name
    //   );
    // });
    // console.log(
    //   "----------------",
    //   authorID,
    //   "----------------",
    //   authorName.name
    // );
    console.log("8888888888888888888888888888888");
    console.log(data);
    res.render("books/index", { data: data });
  } catch (err) {
    res.render("books/index", {
      data: data,
      errorMessage:
        "There is something wrong with accessing books Data. Please Contact Support.",
    });
  }
});

// route to render the add book page
router.get("/addBook", async (req, res) => {
  //fucntion for reder the page with handling the error
  renderNewPage(res, new bookSchema());
});

// route to add the book data
router.post("/addBook", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new bookSchema({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  });
  // console.log(book);
  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`)
    res.redirect("/books");
  } catch {
    renderNewPage(res, book, true);
  }
});
// //route to render the edit book page with sending the id of book via url
// router.get("/editBook/:userId", async (req, res) => {

// });

// //route to edit the book information
// router.post("/editBook", async (req, res) => {

// });

// //route to delete the book
// router.get('/deleteBook/:userId', async(req, res) => {

// })

//fucntion for reder the page with handling the error
async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await authorSchema.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError)
      params.errorMessage =
        "There is Some Error in Creating bookSchema! Check Whether you fill the information Correctly";
    res.render("books/addBook", params);
  } catch {
    res.redirect("/books");
  }
}
module.exports = router;
