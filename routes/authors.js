var express = require("express");
var router = express.Router();
const authorSchema = require("../model/authorSchema");

//route to get all authors
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    let data = await authorSchema.find(searchOptions);
    res.render("authors/index", {
      searchOptions: req.query,
      data: data,
    });
  } catch (err) {
    res.render("authors/index", {
      data: data,
      errorMessage:
        "There is something wrong with accessing books Data. Please Contact Support.",
    });
  }
});

// route to render the add author page
router.get("/addAuthor", (req, res) => {
  res.render("authors/addAuthor", { author: new authorSchema() });
});

// route to add the author data
router.post("/addAuthor", async (req, res) => {
  const author = new authorSchema({
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    contact: req.body.contact,
  });
  try {
    // let data = req.body;
    // await new authorSchema(data).save();
    const newAuthor = await author.save();
    res.redirect("/authors");
  } catch (err) {
    res.render("authors/addAuthor", {
      author: author,
      errorMessage: "There is some ERROR in creating Author",
    });
  }
});

//route to render the edit author page with sending the id of author via url
router.get("/editAuthor/:userId", async (req, res) => {
  try {
    let author = await authorSchema.findOne({ _id: req.params.userId });
    res.render("authors/editAuthor", {
      author: author,
    });
  } catch (err) {
    res.render("authors/editAuthor", {
      errorMessage: "Error in fetching the Author data",
    });
  }
});

//route to edit the author
router.post("/editAuthor", async (req, res) => {
  try {
    await authorSchema.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body }
    );
    res.redirect("/authors");
  } catch (err) {
    res.render("authors/editAuthor", {
      errorMessage: "There is some ERROR in Edit Author",
    });
  }
});

//route to delete the author
router.get("/deleteAuthor/:userId", async (req, res) => {
  try {
    await authorSchema.findOneAndDelete({ _id: req.params.userId });
    res.redirect("/authors");
  } catch (err) {
    res.render("authors/index", {
      errorMessage: "There is some ERROR in Deleting Author",
    });
  }
});
module.exports = router;
