// ====================
// CAMPGROUND ROUTES
// ====================

// Campground.create(
//     {
//     name: "Mountain's view",
//     image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg",
//     description: "This is a Mountain's Hill , No bathrooms. Beautiful Sight"

//     }, function(err, campground){
//        if(err){
//            console.log(err);
//        } else{
//            console.log(campground);
//        }
//     });
var mongoose = require("mongoose");
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/campgrounds", function(req, res){
     // get all Campgrounds from db
     Campground.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         } else{
             res.render("index", {campgrounds: allCampgrounds});
         }
     });
});
 
router.post("/campgrounds", isLoggedIn, function(req, res){
 
    // Get data from form and add to compounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log("Error occured!")
        } else{
            // redirect to campgrounds page
            console.log(campground);
            req.flash("success", "Successfully added Campground");
            res.redirect("/campgrounds");
        }
    });
});
 
 router.get("/campgrounds/new", isLoggedIn, function(req, res){
     res.render("new");
 }); 
 
router.get("/campgrounds/:id", function(req, res){
     //  Find the campground with provided id 
     var foundCampground = Campground.findById(req.params.id);
     foundCampground.populate("comments").exec(function(err, foundCampground){
         if(err || !foundCampground){
             req.flash("error", "Campground not found");
             res.redirect("back");
         } else{
             // render show template with that campground 
             res.render("show", {campground: foundCampground});
         }
     });
});

mongoose.set('useFindAndModify', false);

// EDIT ROUTE
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("edit", {campground: foundCampground});          
        });
}); 

// UPDATE ROUTE
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
     // find and update the campground
     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
         if(err){
             res.redirect("/campgrounds");
         } else{
             res.redirect("/campgrounds/" + req.params.id);
         }
    });
     // redirect to show page
});

// DELETE ROUTE
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
     Campground.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/campgrounds");
         } else{
            req.flash("success", "Campground deleted successfully");
            res.redirect("/campgrounds");
         }
    })
});

// MIDDLEWARE FUNCTION 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "YOU NEED TO LOGIN TO DO THAT");
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "Campground not found!")
                res.redirect("back");
            }  else{
                // check if campground is made by user
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
          });
    } else{
        req.flash("error", "YOU NEED TO LOGIN TO DO THAT");
        res.redirect("back");
    }
};
 module.exports = router;