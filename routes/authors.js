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
    res.render("authors/addAuthor", {
      data: data,
      errorMessage: err,
    });
  }
});

// route to render the add author page
router.get("/addAuthor", (req, res) => {
  res.render("authors/addAuthor");
});

// route to add the author data
router.post("/addAuthor", async (req, res) => {
  try {
    let data = req.body;
    await new authorSchema(data).save();
    res.redirect("/authors");
  } catch (err) {
    res.render("authors/addAuthor", {
      data: data,
      errorMessage: err,
    });
  }
});

//route to render the edit author page with sending the id of author via url
router.get("/editAuthor/:userId", async (req, res) => {
  try {
    let author = await authorSchema.findOne({ _id: req.params.userId });
    res.render("authors/editAuthor", {
      author: author
    });
  } catch (err) {
    res.render("authors/editAuthor", {
      errorMessage: err
    });
  }
});

//route to edit the author 
router.post("/editAuthor", async (req, res) => {
  try {
    await authorSchema.findOneAndUpdate({ _id: req.body._id }, { $set: req.body });
    res.redirect("/authors");
  } catch (err) {
    res.render("authors/editAuthor", {
      errorMessage: err
    });
  }
});

//route to delete the author
router.get('/deleteAuthor/:userId', async(req, res) => {
  try {
    await authorSchema.findOneAndDelete({ _id: req.params.userId });
    res.redirect('/authors');
  } catch (err) {
    res.render("authors/index", {
      errorMessage: err
    });
  }
})
module.exports = router;
