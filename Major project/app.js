
const _util = require("util");
if (typeof _util.isArray !== "function" || _util.isArray !== Array.isArray) {
  try {
    _util.isArray = Array.isArray;
  } catch (e) {
   
  }
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    
    // Initialize sample data if database is empty
    const count = await Listing.countDocuments();
    if (count === 0) {
      console.log("No listings found, initializing sample data...");
      const initData = require("./init/data.js");
      await Listing.insertMany(initData.data);
      console.log("Sample data initialized successfully");
    } else {
      console.log(`Found ${count} existing listings`);
    }
  } catch (err) {
    console.error("MongoDB connection/initialization error:", err);
    process.exit(1);
  }
}

// Connect to MongoDB and then start the server
main()
  .then(() => {
    app.listen(8080, () => {
      console.log("Server is listening on port 8080");
    });
  })
  .catch((err) => {
    console.error("Failed to start the application:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
  secret: "mysupersecretcose",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 *  60 *1000,
    maxAge:  7 * 24 * 60 *  60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.currentPath = req.path; 
  next();
});

app.get("/", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    console.log("Found listings:", allListings.length);
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Error fetching listings");
  }
});

app.get("/demouser",async (req, res) => {
  try {
    let fakeUser = new User({
      email: "student@gmail.com",
      username: "delta-student",
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    // Log the demo user in for quick testing
    req.login(registeredUser, (err) => {
      if (err) return res.status(500).send("Demo login failed");
      req.flash("success", "Logged in as demo user");
      return res.redirect("/listings");
    });
  } catch (e) {
    console.error("Demo user creation/login failed:", e);
    res.status(500).send("Demo setup failed");
  }
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.use((req, res, next ) =>{
   next(new ExpressError(404, "Page Not Found!"));
});
 

app.use((err,req,res,next) =>{
  let {statusCode = 500, 
    message="Somthing went wrong!"} = err;
 res.status (statusCode).render("error.ejs",{message});
});













