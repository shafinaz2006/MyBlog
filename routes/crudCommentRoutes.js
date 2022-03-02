let express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  blogData = require("../models/blogData"),
  blogUser = require("../models/blogUser"),
  blogComment = require("../models/blogComment"),
  contactData = require("../models/contact"),
  middlewareObj = require("../middleware"),
  util = require("util");

// NEW COMMENT Routes:

//NEW COMMENT GET Route:

router.get(
  "/blogs/:id/comments/new",
  middlewareObj.isLoggedIn,
  function (req, res) {
    blogData.findById(req.params.id, function (err, foundBlog) {
      if (err) console.log(err);
      else {
        let newCommenter = { id: req.user._id, commenter: req.user.username };
        console.log("/blogs/:id/comments/new GET Route is accessed");
        console.log(
          "newCommenter at GET: " +
            util.inspect(newCommenter, false, null, true /* enable colors */)
        );
        res.render("commentsNew.ejs", {
          blog: foundBlog,
          commenter: newCommenter,
        });
      }
    });
  }
);

//POST COMMENT Route

router.post("/blogs/:id/comments", function (req, res) {
  blogData.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      blogComment.collection.dropIndexes(function (err, reply) {
        if (err) {
          console.log('Couldn"t drop all indexes' + err);
        } else {
          let newBlogComment = { text: req.body.blogCommentText };
          blogComment.create(newBlogComment, function (err, newBlogComment) {
            if (err) {
              console.log(err);
            } else {
              newBlogComment.commentedBy = {
                commenter: req.user.username,
                id: req.user._id,
              };
              newBlogComment.save();
              console.log("New comment: " + newBlogComment);
              foundBlog.comments.push(newBlogComment);
              foundBlog.save();
              console.log("New Blog with comment: " + foundBlog);
              //res.send(foundBlog)
              req.flash("success", "New Comment is added");
              res.redirect("/blogs/" + foundBlog._id); // redirecting: '/blogs/:id
            }
          });
        }
      });
    }
  });
});

//COMMENT EDIT:

//COMMENT EDIT PUT Route:

router.put("/blogs/:id/comments/:comment_id", function (req, res) {
  req.body.blogComment.text = req.sanitize(req.body.blogComment.text); //sanitized user input
  console.log("updated comment text: " + req.body.blogComment.text);
  console.log(
    "***: " +
      util.inspect(req.body.blogComment, false, null, true /* enable colors */)
  );

  blogComment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.blogComment,
    { new: true },
    function (err, updatedComment) {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        console.log("updated comment: " + updatedComment);
        let query = {
          _id: req.params.id,
          "comments._id": req.params.comment_id,
        };
        let update = { $set: { "comments.$.text": updatedComment.text } };
        blogData.findOneAndUpdate(
          query,
          update,
          { new: true },
          function (err, foundBlog) {
            if (err) console.log(err);
            else {
              console.log("updated comment in foundBlog: " + foundBlog.comments);
              console.log("blog after comment update: " + foundBlog);
              req.flash("success", "Comment is updated");
              res.redirect("/blogs/" + req.params.id);
            }
          }
        );
      }
    }
  );
});

//COMMENT EDIT GET Route:

router.get(
  "/blogs/:id/comments/:comment_id/edit",
  middlewareObj.isCommenterAuthorized,
  function (req, res) {
    blogData.findById(req.params.id, function (err, foundBlog) {
      if (err) console.log(err);
      else {
        blogComment.findById(
          req.params.comment_id,
          function (err, foundComment) {
            if (err) res.redirect("/blogs");
            else {
              console.log("Comment to edit is: " + foundComment);
              res.render("commentsEdit.ejs", {
                blog: foundBlog,
                oldComment: foundComment,
              });
            }
          }
        );
      }
    });
  }
);

// COMMENT DELETE Route:

router.delete(
  "/blogs/:id/comments/:comment_id",
  middlewareObj.isCommenterAuthorized,
  function (req, res) {
    let query = { _id: req.params.id, "comments._id": req.params.comment_id };

    blogData.findById(req.params.id, function (err, foundBlog) {
      if (err) console.log(err);
      else {
        blogComment.findByIdAndRemove(
          req.params.comment_id,
          function (err, foundComment) {
            if (err) {
              console.log(err);
              req.flash("error", "Comment is not deleted");
            } else {
              foundBlog.comments.pull(foundComment);
              foundBlog.save();
              console.log("foundBlog after comment delete: " + foundBlog);
              req.flash("success", "Comment is deleted");
              res.redirect("/blogs/" + req.params.id);
            }
          }
        );
      }
    });
  }
);

module.exports = router;
