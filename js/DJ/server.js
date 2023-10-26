var express = require('express');
var app     = express();

//Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../'));

//Index page
app.get('/index', function(req, res) {
    console.log("index page");
    res.render('index.ejs');
});

app.get('/manage', function(req, res){
    console.log("Manage page");
    res.render('manage.ejs');
})

//About page
app.get('/playlist', function(req, res) {
    console.log("Playlist page");
    res.render('playlist.ejs');
});

app.listen(8080);
console.log('Server is listening on port 8080');