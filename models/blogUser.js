let mongoose = require("mongoose");
//mongoose.set('useCreateIndex', true);

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
  .catch(err => console.log("error: " + err.message));

let passportLocalMongoose = require("passport-local-mongoose");

let blogUserSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
});

blogUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("blogUser", blogUserSchema);
