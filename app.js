var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.post('/', function (req, res) {
    res.send('POST request received');
});

app.put('/', function (req, res) {
    res.send('PUT request received');
});

app.head('/', function (req, res) {
    res.send('HEAD request received');
});

app.delete('/', function (req, res) {
    res.send('DELETE request received');
});

app.patch('/', function (req, res) {
    res.send('PATCH request received');
});

app.copy('/', function (req, res) {
    res.send('COPY request received');
});

app.options('/', function (req, res) {
    res.send('OPTIONS request received');
});

app.link('/', function (req, res) {
    res.send('LINK request received');
});

app.unlink('/', function(req, res) {
    res.send('UNLINK request received');
});

app.purge('/', function (req, res) {
    res.send('PURGE request received');
});

app.lock('/', function (req, res) {
    res.send('LOCK request received');
});

app.unlock('/', function (req, res) {
    res.send('UNLOCK request received');
});

app.propfind('/', function (req, res) {
    res.send('PROPFIND request received');
});

// catch 404 and forward to error handler

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(3000, function() {
    console.log('App API listening in on port 3000')
});

module.exports = app;
