
var name = "Sepehr";

// Artists and songs data
var artistsAndSongs = [
    { id: 1, artist: 'Artist 1', song: 'Song 1' },
    { id: 2, artist: 'Artist 2', song: 'Song 2' },
    { id: 3, artist: 'Artist 3', song: 'Song 3' }
    // add more if needed
];

var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../'));



// Redirect from root to /index
app.get('/', function(req, res) {
    res.redirect('/index');
});


// Producers main page
app.get('/index', function(req, res) {
    res.render('pages/index', { userName: name, playlist: artistsAndSongs });
});

// DJ-page 
app.get('/DJ-page', function(req, res){
    res.render('pages/DJ-page', { userName: name, playlist: artistsAndSongs });
});

// Feedback page
app.get('/feedback', function(req, res) {
    res.render('pages/feedback', { userName: name }); //Iteration 5 consider pass the message to DJ profile 
});

//trends page
app.get('/trend', function(req, res) {
    res.render('pages/trend', { userName: name, playlist: artistsAndSongs });
});


app.listen(8080);
console.log('Server is listening on port 8080');
