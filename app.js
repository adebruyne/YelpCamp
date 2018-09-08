var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

//seed the database
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIGURTATION
app.use(
  require("express-session")({
    secret: "Camping is the best!",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
})






//homepage
app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX ROUTE -- SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res) {
  // console.log(req.user);

  //Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user
      });
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
  //find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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

// =========
//AUTH ROUTES

//show register form
app.get("/register", function(req, res) {
  res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/campgrounds");
    });
  });
});

//show login form
app.get("/login", function(req, res) {
  res.render("login");
});

//handle login logic
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

//logout route
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(8886, () => {
  console.log("The Yelpcamp server has started!");
});
