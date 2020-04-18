
var  mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

mongoose.set('useFindAndModify', false);

// mongoose.connect('mongodb://localhost:27017/myBlogdB_V3', {
// 								useUnifiedTopology: true,
// 								useNewUrlParser: true,
// 							     });
// mongoDB ATLAS link is required
mongoose.connect('******', {
					useUnifiedTopology: true,
					useNewUrlParser: true,
				}).then(() =>{
					console.log('DB is connected');
				}).catch(err =>{
					console.log('error: ' + err.message);
				});

var passportLocalMongoose  = require('passport-local-mongoose');

var blogCommentSchema = new mongoose.Schema({

	 commentedBy: {
		 
		 id: {
			 type: mongoose.Schema.Types.ObjectId,
			 ref: 'blogUser'
		  },
		 commenter: {type: String}
	 },
	
	text: {type: String}, 
	
	commentedOn: {type: Date, default: Date.now},
	
	
});


blogCommentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('blogComment', blogCommentSchema);


