// To delete database we use db.campgrounds.drop()
// IMPORTANT NOTE----
/* WE HAVE TO USE currentUser: req.user this user info in every route to get working 
    rather doing one by one we do 
   
    app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next();
}); 
   in above code res.locals refer to the ejs files because of header.ejs logic code that we write  
   IT IS A MIDDLEWARE FUNCTION 
   */
var express       = require("express"),
    app           = express(),
    request       = require("request"),
    bodyParser    = require("body-parser"),
    methodOverride = require("method-override"),
    passport      = require("passport"),
    flash         = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    mongoose      = require("mongoose"),
    Campground    = require("./models/campground.js"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

// REQUIRING ROUTES
var authRoutes = require("./routes/auth");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");

app.use(flash());

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Execute seedDB function
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
     secret: "Yeah You unlocked the case!",
     resave: false,
     saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// for using locals in all ejs
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
// USING ROUTES
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

// app.listen(process.env.PORT, process.env.ID, function(req, res){
//     console.log("Server is Started!");
// });

app.listen(3000, process.env.PORT, process.env.ID, function(req, res){
    console.log("Server is Started!");
});

