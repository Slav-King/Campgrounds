
// ==================================
// COMMENT ROUTES
// ================================

var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else{
        res.render("comments/new", {campground: campground});    
       }
    });
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   // find campground
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else{
           Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              } else{
                  // add the username to comment
                  comment.author.username = req.user.username;
                  comment.author.id = req.user._id;
                  // save comment 
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  console.log(comment);
                  req.flash("success", "Successfully added comment");
                  res.redirect("/campgrounds/" + campground._id);
              }
           });
       }
   });
});
//COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
      }); 
    });                  
});

// COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){   
        Comment.findByIdAndRemove(req.params.comment_id, function(err){
            if(err){
                res.redirect("back");
            } else{
                req.flash("success", "Comment deleted");
                res.redirect("/campgrounds/" + req.params.id);
            }
       });
});

// MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "YOU NEED TO LOGIN TO DO THAT");
    res.render("login");
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Cannot not found"); 
                res.redirect("back");
            }  else{
                // check if comment is made by user
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
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