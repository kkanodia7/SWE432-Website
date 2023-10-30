var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../'));

// Playlists page
app.get('/index', function(req, res) {
    res.render('pages/index.ejs');
});

// Favorites page
app.get('/favorites', function(req, res){
    res.render('pages/favorites.ejs');
})

// Recommended page
app.get('/recommended', function(req, res) {
    res.render('pages/recommended.ejs');
});

app.listen(8080);
console.log('Server is listening on port 8080');