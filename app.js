var express = require("express");
var app = express();

var bodyParser = require("body-parser");



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var campgrounds = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&auto=format&fit=crop&w=900&q=60"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1525209149972-1d3faa797c3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=053f91dd9aee1cc7bc5cafca28cb625c&auto=format&fit=crop&w=900&q=60"},
    {name: "Mountain Goat Rest", image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c85daa025ee04c951b6ac12fe3ba031a&auto=format&fit=crop&w=900&q=60"}

];

//homepage
app.get("/", function(req,res){
    res.render("landing");
})

//campgrounds
app.get("/campgrounds", function(req,res){
    

    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    // res.send("You hit the post route")
    //get data from form and add to campgrounds array
    var name = req.body.name ;
    var image = req.body.image ;
    var newCampground = {name: name, image: image}; 
    campgrounds.push(newCampground)
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
})

app.listen(8886, () => {
    console.log("The Yelpcamp server has started!")
})