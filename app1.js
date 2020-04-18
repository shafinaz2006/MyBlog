
const express  			= require('express'),
	  app 			= express(),
	  request       	= require('request'),
	  bodyparser 		= require('body-parser'),
	  methodOverride 	= require('method-override'),
	  expressSanitizer 	= require('express-sanitizer'),
	  mongoose		= require('mongoose'),
	  flash 		= require('connect-flash'),
	  passport 		= require('passport'),
	  passportLocal 	= require('passport-local'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  blogData 		= require('./models/blogData'),
	  blogUser 		= require('./models/blogUser'),
	  blogComment 		= require('./models/blogComment'),
	  contactData 		= require('./models/contact'),
	  util 			= require('util'),
	  logTimeStamp 		= require('log-timestamp');

var crudBlogRoutes 		= require('./routes/crudBlogRoutes'),
	crudCommentRoutes 	= require('./routes/crudCommentRoutes'),
	indexRoutes 		= require('./routes/indexRoutes'),
	date 			= new Date();

app.use(express.static(__dirname + '/public'));

//app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(expressSanitizer());

app.use(
	require('express-session')({
		cookie: { maxAge: 5*60*60*1000 },
		secret: 'secret code',
		resave: false,
		saveUninitialized: false
	})
);

app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

passport.use(new passportLocal(blogUser.authenticate())); // works to user authentication- checks while log in

passport.serializeUser(blogUser.serializeUser());

passport.deserializeUser(blogUser.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;

	res.locals.error = req.flash('error');

	res.locals.success = req.flash('success');

	next();
});

// Getting Current Blogger data for all the pages:

app.use(function(req, res, next) {
	blogUser.find({}, function(err, blogUsers) {
		if (err) {
			console.log('blog User data not found');
		} else {
			res.locals.blogUsers = blogUsers;

			next();
		}
	});
});

// ROUTES:

app.use(indexRoutes);

app.use(crudBlogRoutes);

app.use(crudCommentRoutes);

// For Regular Listening:

app.listen(3000, () => {
	console.log('server listening on port 3000');
});

// Listening through Heroku PORT:

var port = process.env.PORT || 5000;

app.listen(port, function (){ 
	console.log("Server Has Started!");
});

