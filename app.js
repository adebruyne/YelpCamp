var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require('./models/user');

//seed the database
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//SCHEMA SETUP

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
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

//CREATE ROUTE --ADD NEW CAMPGROUND TO DATABASE
app.post("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");
});

//SHOW ROUTE -- SHOW MORE INFO ABOUT ONE CAMPGROUND
app.get("/campgrounds/:id", function(req, res) {
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

//=================================
//  COMMENTS Routes
// ================================

app.get("/campgrounds/:id/comments/new", function(req, res) {
  //find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res) {
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          //create new comment
          campground.comments.push(comment);
          //connect new comment to campground
          campground.save();
          //redirect campground  show page
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

app.listen(8886, () => {
  console.log("The Yelpcamp server has started!");
});
