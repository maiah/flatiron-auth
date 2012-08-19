var flatiron = require('flatiron'),
    app = flatiron.app,
    connect = require('connect');

var setRequestOriginalUrl = function(req, res) {
  req.originalUrl = req.url;
  res.emit('next');
};

var authenticate = function(req, res) {
  console.log('Authenticating...');
  res.emit('next');
};

app.use(flatiron.plugins.http, {
  before: [
    setRequestOriginalUrl,
    connect.favicon(),
    connect.bodyParser(),
    connect.cookieParser('catspy speed'),
    connect.session(),
    authenticate
  ]
});

app.router.get('/', function() {
  this.res.writeHead(200, { "Content-Type": "text/plain" });
  this.res.end("This app shows a basic Flatiron.js authentication.");
});

app.listen(7000, function(err) {
  console.log('Flatiron started on port 7000');
});