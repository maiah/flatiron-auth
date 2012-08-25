var flatiron = require('flatiron'),
    app = flatiron.app,
    connect = require('connect'),
    Plates = require('plates');

var users = {
  "catspy": "steps",
  "milo": "man"
};

app.use(flatiron.plugins.http, {
  before: [
    connect.favicon(),
    connect.cookieParser('catpsy speeds'),
    function(req, res) {
      if (req.originalUrl === undefined) {
        req.originalUrl = req.url;
      }
      res.emit('next');
    },
    connect.session(),
    function(req, res) {
      console.log('Authenticating...');
      console.dir(req.session);;
      if (req.url !== '/login' && req.session.user === undefined) {
        res.redirect('/login');
      } else {
        res.emit('next');
      }
    }
  ]
});

app.router.get('/', function() {
  var html = 'Hello <span id="user"></span>. This app shows a basic Flatiron.js authentication. ' + 
             '<a href="/logout">Logout.</a>';
  var data = { "user": this.req.session.user };

  this.res.writeHead(200, { "Content-Type": "text/html" });
  this.res.end(Plates.bind(html, data));
});

app.router.get('/login', function() {
  if (this.req.session.user) {
    this.res.redirect('/');
  } else {
    var loginError = this.req.session.loginError ? this.req.session.loginError : '';
    var data = { "errMsg": loginError };
    var html = '<!DOCTYPE html>' +
               '<html>' +
               '<body>' +
               '<div id="errMsg"></div>' +
               '<form action="/login" method="POST">' +
               '<input type="text" name="username" placeholder="Username" /><br />' +
               '<input type="password" name="password" placeholder="Password" /><br />' +
               '<input type="submit" value="Login" />' +
               '</form>' +
               '</body>' +
               '<html>';

    this.res.writeHead(200, { "Content-Type": "text/html" });
    this.res.end(Plates.bind(html, data));
  }
});

app.router.post('/login', function() {
  var res = this.res;

  var username = this.req.body.username;
  var userPass = users[username];
  if (userPass && userPass === this.req.body.password) {
    delete this.req.session['loginError'];
    this.req.session.user = username;
  } else {
    delete this.req.session['user'];
    this.req.session.loginError = 'Wrong username or password.';
  }

  this.req.session.save(function(err) {
    if (err) {
      throw err
    }
    res.redirect('/');
  });
});

app.router.get('/logout', function() {
  this.req.session.destroy();
  this.res.redirect('/');
});

app.router.get('/hey', function() {
  var html = 'Hello <span id="user"></span>. This is another secured page. ' + 
             '<a href="/logout">Logout.</a>';
  var data = { "user": this.req.session.user };

  this.res.writeHead(200, { "Content-Type": "text/html" });
  this.res.end(Plates.bind(html, data));
});

app.listen(7000, function(err) {
  console.log('Flatiron started on port 7000');
});