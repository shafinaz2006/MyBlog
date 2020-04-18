
var mongoose = require('mongoose');
//mongoose.set('useCreateIndex', true);

mongoose.set('useFindAndModify', false);

// mongoose.connect('mongodb://localhost:27017/myBlogdB_3V', {
// 								useUnifiedTopology: true,
// 								useNewUrlParser: true,
// 								});

mongoose.connect('mongodb+srv://shafis:shafis@cluster0-9fqzb.mongodb.net/test?retryWrites=true&w=majority', {
					useUnifiedTopology: true,
					useNewUrlParser: true,
				}).then(() =>{
					console.log('DB is connected');
				}).catch(err =>{
					console.log('error: ' + err.message);
				});


var passportLocalMongoose  = require('passport-local-mongoose');

var blogUserSchema = new mongoose.Schema({
	
	 username: { type: String },
	 email: { type: String },
	 	 	
});

blogUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('blogUser', blogUserSchema);
