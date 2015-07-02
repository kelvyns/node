var express    = require("express");
var path = require('path');
var bodyParser = require('body-parser');

var config = require('./lib/config');
var mock = require('./routes/index');
var updater = require('./routes/updater');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', mock);
app.use('/api/updater/', updater);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(config.local_port, config.local_ip, function(){ console.log('server listening on port '+ config.local_port ); });
