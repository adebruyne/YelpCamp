var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//=============
//INDEX ROUTE -- SHOW ALL CAMPGROUNDS
router.get("/campgrounds", function(req, res) {
  // console.log(req.user);

  //Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds
      });
    }
  });
});

//CREATE ROUTE --ADD NEW CAMPGROUND TO DATABASE
router.post("/campgrounds", function(req, res) {
  // res.send("You hit the post route")
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  //create a new object
  var newCampground = { name: name, image: image, description: desc };
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
router.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");
});

//SHOW ROUTE -- SHOW MORE INFO ABOUT ONE CAMPGROUND
router.get("/campgrounds/:id", function(req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that campground
        console.log(foundCampground);

        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

module.exports = router;
