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
    function(req, res) {
      if (req.originalUrl === undefined) {
        req.originalUrl = req.url;
      }
      res.emit('next');
    },
    function(req, res) {
      console.log('Authenticating...');
      console.log('REQUEST HEADERS:');
      console.log(req.headers.cookie);
      if (req.url !== '/login') {
        //var errMsg = req.session.loginError ? '<i>' + req.session.loginError + '</i><br />' : '';
        var html = '<!DOCTYPE html>' +
                   '<html>' +
                   '<body>' +
                   //errMsg +
                   '<form action="/login" method="POST">' +
                   '<input type="text" name="username" placeholder="Username" /><br />' +
                   '<input type="password" name="password" placeholder="Password" /><br />' +
                   '<input type="submit" value="Login" />' +
                   '</form>' +
                   '</body>' +
                   '<html>';

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } else {
        res.emit('next');
      }
    }
  ]
});

app.router.get('/', function() {
  this.res.writeHead(200, { "Content-Type": "text/plain" });
  this.res.end("This app shows a basic Flatiron.js authentication.");
});

app.router.post('/login', function() {
  var username = this.req.body.username;
  var userPass = users[username];
  if (userPass && userPass === this.req.body.password) {
    console.log('Login correct!');
    this.res.setHeader('Set-Cookie', ['user=' + username]);  
  } else {
    console.log('Login wrong!');
    //this.req.session.loginError = 'Wrong username or password.';
  }

  this.res.redirect('/');
});

app.listen(7000, function(err) {
  console.log('Flatiron started on port 7000');
});