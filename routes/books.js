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

//! ALL BOOKS ROUTE
// router.get("/", async (req, res) => {
//   let searchOptions = {};
//   if (req.query.title != null && req.query.title !== "") {
//     // searchOptions.title = new
//   }
//   try {
//     let data = await bookSchema.find();
//     // data.forEach(async (ele) => {
//     //   let authorID = ele.author;
//     //   let authorName = await authorSchema.findById(authorID);
//     //   console.log(ele.author);
//     //   console.log("------------");
//     //   ele.author = authorName;
//     //   console.log(ele.author);
//     //   console.log(";;;;;;;;;;;;;;;;;;;;;;;;;");
//     //   console.log(ele);
//     //   // console.log(
//     //   //   "----------------",
//     //   //   authorID,
//     //   //   "----------------",
//     //   //   authorName.name
//     //   // );
//     // });
//     // data.forEach(async (ele) => {
//     //   let authorID = ele.author;
//     //   let authorName = await authorSchema.findById(authorID);
//     //   ele[author] = authorName;
//     //   console.log(
//     //     "----------------",
//     //     authorID,
//     //     "----------------",
//     //     authorName.name
//     //   );
//     // });
//     // console.log(
//     //   "----------------",
//     //   authorID,
//     //   "----------------",
//     //   authorName.name
//     // );
//     console.log("8888888888888888888888888888888");
//     console.log(data);
//     res.render("books/index", { data: data });
//   } catch (err) {
//     res.render("books/index", {
//       data: data,
//       errorMessage:
//         "There is something wrong with accessing books Data. Please Contact Support.",
//     });
//   }
// });

router.get("/", async (req, res) => {
  // let searchOptions = {};
  // if (req.query.title != null && req.query.title !== "") {
  //   searchOptions.title = new RegExp(req.query.title, "i");
  // }
  let query = bookSchema.find();
  if (req.query.title != null && req.query.title !== "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }

  if (req.query.publishedAfter != null && req.query.publishedAfter !== "") {
    query = query.gte("publishDate", req.query.publishedAfter);
  }

  if (req.query.publishedBefore != null && req.query.publishedBefore !== "") {
    query = query.lte("publishDate", req.query.publishedBefore);
  }

  try {
    // let data = await bookSchema.find(searchOptions);
    const data = await query.exec();
    console.log(data);
    res.render("books/index", { data: data, searchOptions: req.query });
  } catch (err) {
    res.render("books/index", {
      data: data,
      errorMessage:
        "There is something wrong with accessing books Data. Please Contact Support.",
    });
  }
});

//! ROUTE TO RENDER THE ADD BOOK
router.get("/addBook", async (req, res) => {
  //fucntion for reder the page with handling the error
  renderNewPage(res, new bookSchema());
});

//! ROUTE TO ADD BOOK DATA
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
    if (book.coverImageName != null) removeBookCover(book.coverImageName);
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

//! FUNCTION FOR RENDER THE PAGE WITH HANDLING THE ERROR
async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await authorSchema.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError)
      params.errorMessage =
        "There is Some Error in Creating Book! Check Whether have you fill the information Correctly";
    res.render("books/addBook", params);
  } catch {
    res.redirect("/books");
  }
}

//! FUNCTION TO REMOVE BOOK COVER IMAGE FROM UPLOADS WHEN IF THERE IS SOME ERROR IN SAVING BOOK DATA AND COVER PAGE IS SAVED BEFORE THAT
function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

module.exports = router;
