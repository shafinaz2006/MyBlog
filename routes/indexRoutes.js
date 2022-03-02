const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  blogData = require("../models/blogData"),
  blogUser = require("../models/blogUser"),
  blogComment = require("../models/blogComment"),
  contactData = require("../models/contact"),
  middlewareObj = require("../middleware"),
  util = require("util");

//INDEX Routes:

router.get("/", function (req, res) {
  res.redirect("/blogs");
});

router.get("/blogs", function (req, res) {
  console.log("inside /blogs link");
  blogData.find({}, function (err, blogs) {
    if (err) console.log(err);
    else res.render("index.ejs", { blogs: blogs });
  });
});

//AUTH Routes:

// Register Routes:

router.get("/register", function (req, res) {
  res.render("register.ejs");
});

// Handling user registration:

router.post("/register", function (req, res) {
  var newblogUser = new blogUser({ username: req.body.username });
  blogUser.register(newblogUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Registration successful for: " + user.username);
      res.redirect("/blogs");
    });
  });
});

// LOG IN Routes:

// Log in Form:

router.get("/login", function (req, res) {
  res.render("login.ejs");
});

// Log in Logic:

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
);

// LOG OUT:

router.get("/logout", function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) return next(err);
      else {
        console.log("logged out");
        res.redirect("/blogs");
      }
    });
  }
});

module.exports = router;
