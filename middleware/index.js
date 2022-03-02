var middlewareObj = {};

var blogData = require("../models/blogData"),
  blogUser = require("../models/blogUser"),
  blogComment = require("../models/blogComment");

// Checks if the user is logged in or not:

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in to your account");
  res.redirect("/login");
};

// Checks if the user is the blogger who can EDIT/DELETE/UPDATE blog:

middlewareObj.isUserAuthorized = function (req, res, next) {
  if (req.isAuthenticated()) {
    blogData.findById(req.params.id, function (err, foundBlog) {
      if (err || !foundBlog) {
        req.flash("error", "Blog is not found");
        res.redirect("back");
      } else {
          if (foundBlog.createdBy.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You are not authorized. Please log in to the blogger account");
            res.redirect("back");
          }
      }
    });
  } else {
    req.flash("error", "Please log in to your account");
    res.redirect("back");
  }
};

// Checks if the user is the commenter who can EDIT/DELETE/UPDATE comment:

middlewareObj.isCommenterAuthorized = function (req, res, next) {
  if (req.isAuthenticated()) {
    blogComment.findById(req.params.comment_id, function (err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Comment is not found");
        res.redirect("back");
      } else {
          if (foundComment.commentedBy.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You are not authorized. Please log in to the commenter account");
            res.redirect("back");
          }
      }
    });
  } else {
    req.flash("error", "Please log in to your account");
    res.redirect("back");
  }
};

module.exports = middlewareObj;
