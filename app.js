var express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	connect = require('connect'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	csrf = require('csurf'),
	post = require('./routes/post'),
	app = express();

var csrfProtection = csrf({ cookie: true })
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(logger('dev'));
app.use(function(req, res, next) {
	console.log('my custom middleware');
	next();
});
//error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.send('form tampered with')
})


//routing
app.get('/', post.index);
app.get('/posts/:id([0-9]+)', post.show);
app.get('/posts/new', csrfProtection, post.new);
app.post('/posts/create', csrfProtection, post.create);
app.get('/posts/:id([0-9]+)/edit', csrfProtection, post.edit);
app.put('/posts/:id([0-9]+)', csrfProtection, post.update);
app.delete('/posts/:id([0-9]+)', post.destroy);

app.get('/', function(req,res) {
	res.render('index', {title: 'title'});
});

app.param('id', function(req, res, next, id) {
	var users = ['taguchi', 'daimori', 'express'];
	req.params.name = users[id];
	next();
});

app.get('/new', function(req, res) {
	res.render('new');
});

app.post('/create', function(req, res) {
	res.send(req.body.name);
});

app.get('/users/:name?', function(req,res) {
	if(req.params.name) {
		res.send('hello ' + req.params.name);
	} else {
		res.send('hello nobody');
	}
});

app.get('/items/:id([0-9]+)?', function(req,res) {
	if (req.params.id){
		res.send('id ' + req.params.id);
	} else {
		res.send('no id');
	}
});

app.listen(3000);
console.log('server listening...');