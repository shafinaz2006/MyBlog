let mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

// mongoose.connect('mongodb://localhost:27017/myBlogdB_V3', {
// 								useUnifiedTopology: true,
// 								useNewUrlParser: true,
// 							     });
// mongoDB ATLAS link is required
mongoose
  .connect("*****", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB is connected"))
  .catch(err => console.log("error: " + err.message));

let passportLocalMongoose = require("passport-local-mongoose");

let contactDataSchema = new mongoose.Schema({
  contactName: { type: String },
  email: { type: String },
  phoneNumber: { type: Number },
  message: { type: String },
  contactedOn: { type: Date, default: Date.now },
});

contactDataSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("contactData", contactDataSchema);
