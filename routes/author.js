var express = require("express");
var router = express.Router();
const authorSchema = require("../model/authorSchema");

//route to get all authors
router.get("/", async (req, res) => {
  let searchOptions = {};
  if( req.query.name != null && req.query.name !== ""){
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    let data = await authorSchema.find(searchOptions);
    res.render("author/index", {
      searchOptions: req.query,
      data: data
    });
  } catch (err) {
    res.render("author/addAuthor", {
      data: data,
      errorMessage: err,
    });
  }
});

// route to render the add author page
router.get("/addAuthor", (req, res) => {
  res.render("author/addAuthor");
});

// route to add the author data
router.post("/addAuthor", async (req, res) => {
  try {
    let data = req.body;
    await new authorSchema(data).save();
    res.redirect("/author");
  } catch (err) {
    res.render("author/addAuthor", {
      data: data,
      errorMessage: err,
    });
  }
});

module.exports = router;
