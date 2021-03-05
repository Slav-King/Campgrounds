// CRUD ---- Create Read Update Destroy
// Mongooseis ODM ---  Object data mapper

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app",
      {useNewUrlParser: true}
  );
// Schema is a pattern 

var catSchema = new mongoose.Schema({
   name: String,
   age: Number,
   temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// var george = new Cat({
//    name: "George",
//    age: 2,
//    temperament: "Grouchy"
// });

// // TO save the above info we have to write below code ...
// // cat parameter is what is retrieving not the george... 
// george.save(function(err, cat){
//     if(err){
//         console.log("We have an error");
//     }else{
//         console.log("Info saved");
//         console.log(cat);
//     }
// });

Cat.create({
    name: "Mrs Catty",
    age: 12,
    temperament: "Cat-family"
}, function(err, cat){
     if(err){
         console.log("Oh No! Error!!!!");
     } else{
         console.log(cat);
     }
});

Cat.find({}, function(err, cats){
    if(err){
        console.log(err);
    }  else {
        console.log(cats);
    }
});



