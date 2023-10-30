var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../'));

// Data to pass in
var name = "Kushal"

// Playlists page
app.get('/index', function(req, res) {
    res.render('pages/index.ejs', {username: name});
});

// Favorites page
app.get('/favorites', function(req, res){
    res.render('pages/favorites.ejs', {username: name});
})

// Recommended page
app.get('/recommended', function(req, res) {
    res.render('pages/recommended.ejs', {username: name});
});

app.listen(8080);
console.log('Server is listening on port 8080');