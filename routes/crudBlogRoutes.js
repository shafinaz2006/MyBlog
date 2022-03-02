const express = require("express"),
  router = express.Router(),
  // mongoose = require("mongoose"),
  // passport = require("passport"),
  blogData = require("../models/blogData"),
  // blogUser = require("../models/blogUser"),
  // blogComment = require("../models/blogComment"),
  contactData = require("../models/contact"),
  middlewareObj = require("../middleware"),
  util = require("util");

// NEW Route

router.get("/blogs/new", middlewareObj.isLoggedIn, function (req, res) {
  console.log("inside /blogs/new GET route " + req.user);
  let createdBy = { id: req.user._id, username: req.user.username };
  res.render("createBlog.ejs", { createdBy: createdBy });
});

// CREATE Route

router.post("/blogs", middlewareObj.isLoggedIn, function (req, res) {
  console.log("inside /blogs/new POST route " + req.user._id);
  let newCreatedBy = { id: req.user._id, bloggername: req.body.username };
  console.log(
    "newCreatedBy is: " +
      util.inspect(newCreatedBy, false, null, true /* enable colors */)
  );
  let newBlogData = {
    title: req.body.title,
    image: req.body.image,
    body: req.body.description,
    createdBy: newCreatedBy,
  };
  console.log("/blogs/new: POST route. New Data is prepared: ");
  console.log(
    "newBlogData before adding db: " +
      util.inspect(newBlogData, false, null, true /* enable colors */)
  );

  blogData.collection.dropIndexes(function (err, reply) {
    if (err) {
      console.log('Couldn"t drop all indexes' + err);
    } else {
      blogData.create(newBlogData, function (err, newBlogData) {
        if (err) {
          console.log("Error" + err);
          res.render("/blogs");
        } else {
          console.log(
            "/blogs/new: POST route. New Data is created: " + newBlogData
          );
          req.flash("success", "New Blog is created successfully");
          res.redirect("/blogs");
        }
      });
    }
  });
});

//SHOW Route:

router.get("/blogs/:id", function (req, res) {
  blogData.findById(req.params.id, function (err, foundBlog) {
    if (err || !foundBlog) {
      console.log(err);
      req.flash("error", "Blog not found");
      res.redirect("/blogs");
    } else {
      res.render("showBlog.ejs", { blog: foundBlog });
    }
  });
});

// EDIT Route

router.get(
  "/blogs/:id/edit",
  middlewareObj.isUserAuthorized,
  function (req, res) {
    blogData.findById(req.params.id, function (err, foundBlog) {
      if (err) {
        console.log(err);
      } else {
        console.log("inside /blogs/:id/edit GET route " + req.user);
        res.render("update.ejs", { blog: foundBlog });
      }
    });
  }
);

//UPDATE Route

router.put("/blogs/:id", middlewareObj.isUserAuthorized, function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body); //sanitized user input in blog[body] field

  // console.log(typeof req.body.blog._id + ' and ' + typeof req.params.id);

  blogData.findByIdAndUpdate(
    req.params.id,
    req.body.blog,
    { new: true },
    function (err, updatedBlog) {
      if (err) {
        req.flash("error", "Your blog is not updated");
        console.log(err);
      } else {
        console.log(
          "*****" +
            util.inspect(updatedBlog, false, null, true /* enable colors */)
        );
        req.flash("success", "Your blog is updated");
        res.redirect("/blogs/" + req.params.id); // redirecting: '/blogs/:id
      }
    }
  );
});

//DELETE Route:

router.delete(
  "/blogs/:id",
  middlewareObj.isUserAuthorized,
  function (req, res) {
    blogData.findByIdAndRemove(req.params.id, function (err, updatedBlog) {
      if (err) {
        console.log(err);
        req.flash("error", "Blog is not deleted. Something went wrong");
      } else {
        req.flash("success", "Blog is removed");
        res.redirect("/blogs"); // redirecting: '/blogs
      }
    });
  }
);

//CONTACT Routes:

// CONTACT GET Route:

router.get("/contact/new", function (req, res) {
  console.log("inside /contact/new GET route ");
  res.render("contactUs.ejs");
});

//CONTACT POST Route:

router.post("/contact", function (req, res) {
  let contactInfo = req.body.contact;
  console.log("/contact: POST route. New Data is prepared: ");
  console.log(
    "contactInfo before adding db: " +
      util.inspect(contactInfo, false, null, true /* enable colors */)
  );

  contactData.create(contactInfo, function (err, contactInfo) {
    if (err) {
      console.log("Error" + err);
      res.render("/blogs");
    } else {
      console.log("/contact: POST route. New Data is created: " + contactInfo);
      //res.send(contactInfo);

      req.flash("success", "Thank you for your query. Our administrator will contact you shortly");
      res.redirect("/blogs");
    }
  });
});

module.exports = router;
