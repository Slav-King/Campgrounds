var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js")

var data = [
    {
        name: "Night stay",
        image: "https://365cincinnati.com/wp-content/uploads/2020/05/Camping-at-the-camground-900x525.jpg",
        description: "A very beautiful place for camping",
        author: {
            id: "5f5fac3929a3301b5eb605d2",
            username: "Kanish"
        }
    },
    {
        name: "Forest",
        image: "https://s3.amazonaws.com/socast-superdesk/media/20200525190536/6404f2f2-e5a6-47cb-bb7a-bf11c17f715b.jpg",
        description: "A safe forest is the best area for camping",
        author: {
            id: "5f5fac3929a3301b5eb605d3",
            username: "Kanish123"
        }
    }
]

function seedDB(){
    // Remove a campground 
    Campground.deleteMany({}, function(err){
        if(err){
        console.log(err);
        } else{
        console.log("Removed Everything!");
        // Add campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else{
                    console.log("Made a Campground!")
                    // Make a comment...
                    Comment.create(
                        {
                            text: "This place is GREAT! but i wish it had wifi",
                            author: {
                                id: "5f5fac3929a3301b5eb605d2",
                                username: "Kanish"
                            }
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                                campground.comments.push(comment)
                                campground.save(function(err){
                                    if(err){
                                        console.log(err);
                                    } else{
                                        console.log("Created a comment!");
                                    }
                                });
                            }
                        });
                }
            });
        });
        }
    });
};

module.exports = seedDB;