var express = require("express");
var app = express();





app.set("view engine", "ejs");

//homepage
app.get("/", function(req,res){
    res.render("landing");
})

//campgrounds
app.get("/campgrounds", function(req,res){
    var campground = [
        {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&auto=format&fit=crop&w=900&q=60"},
        {name: "Granite Hill", image: "https://images.unsplash.com/photo-1525209149972-1d3faa797c3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=053f91dd9aee1cc7bc5cafca28cb625c&auto=format&fit=crop&w=900&q=60"},
        {name: "Mountain Goat Rest", image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c85daa025ee04c951b6ac12fe3ba031a&auto=format&fit=crop&w=900&q=60"}

    ]
});


app.listen(8886, () => {
    console.log("The Yelpcamp server has started!")
})