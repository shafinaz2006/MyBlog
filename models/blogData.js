let mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

// mongoose.connect('mongodb://localhost:27017/myBlogdB_3V', {
// 								useUnifiedTopology: true,
// 								useNewUrlParser: true,
// 								});
// mongoDB ATLAS link is required
mongoose
  .connect("*******", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log("error: " + err.message));

let passportLocalMongoose = require("passport-local-mongoose");

let blogDataSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
  createdBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogUser",
    },
    bloggername: { type: String },
  },

  comments: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogComment",
      },
      commentedBy: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "blogUser",
        },
        commenter: { type: String },
      },
      text: { type: String },
      commentedOn: { type: Date },
    },
  ],
});

blogDataSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("blogData", blogDataSchema);
