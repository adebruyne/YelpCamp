var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Granite Hill",
//     image:
//       "https://images.unsplash.com/photo-1525209149972-1d3faa797c3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=053f91dd9aee1cc7bc5cafca28cb625c&auto=format&fit=crop&w=900&q=60",
//     description:
//       "This is a huge granite hill. No bathrooms. No water. But it sure is pretty."
//   },
//   function(err, campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("NEWLY CREATED CAMPGROUND: ");
//       console.log(campground);
//     }
//   }
// );

//homepage
app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX ROUTE -- SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res) {
  //Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", { campgrounds: allCampgrounds });
    }
  });
});

//CREATE ROUTE --ADD NEW CAMPGROUND TO DATABASE
app.post("/campgrounds", function(req, res) {
  // res.send("You hit the post route")
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  //create a new object
  var newCampground = { name: name, image: image };
  //Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

//NEW ROUTE -- SHOW FORM TO CREATE NEW CAMPGROUND
app.get("/campgrounds/new", function(req, res) {
  res.render("new.ejs");
});

//SHOW ROUTE -- SHOW MORE INFO ABOUT ONE CAMPGROUND
app.get("/campgrounds/:id", function(req, res) {
  //find the campground with provided ID
  //render show template with that campground
res.render("show");
});

app.listen(8886, () => {
  console.log("The Yelpcamp server has started!");
});
