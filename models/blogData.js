
var  mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// mongoose.connect('mongodb://localhost:27017/myBlogdB_3V', {
// 														useUnifiedTopology: true,
// 														useNewUrlParser: true,
// 														});

mongoose.connect('mongodb+srv://shafis:shafis@cluster0-9fqzb.mongodb.net/test?retryWrites=true&w=majority', {
					useUnifiedTopology: true,
					useNewUrlParser: true,
				}).then(() =>{
					console.log('DB is connected');
				}).catch(err =>{
					console.log('error: ' + err.message);
				});

var passportLocalMongoose  = require('passport-local-mongoose');

var blogDataSchema = new mongoose.Schema({
	
	 title: String,
	 image: String,
	 body: String,
	 created: {type: Date, default: Date.now},
	 createdBy: {
		 
		 id: {
			 type: mongoose.Schema.Types.ObjectId,
			 ref: 'blogUser'
		  },
		 bloggername: {type: String}
	 },
	
	comments: [{
		
		id: {
			
			type: mongoose.Schema.Types.ObjectId,
			ref: 'blogComment'
		},
		
		commentedBy: {
		 
			 id: {
				 type: mongoose.Schema.Types.ObjectId,
				 ref: 'blogUser'
			  },
			 commenter: {type: String}
		 },
		
		text: {type: String},
		
		commentedOn: {type: Date}
		
	}]
	
});


blogDataSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('blogData', blogDataSchema);


