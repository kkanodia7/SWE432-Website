const fs = require('fs');
const path = require('path');
var express = require('express');
const { timeStamp } = require('console');
var app     = express();

//Locally stored timeslot info, to be placed in DB later
const jsonPath = path.join(__dirname, 'public', 
                           'timeslots.json');

const jsonData = fs.readFileSync(jsonPath, 'utf8');
const ts = JSON.parse(jsonData);
console.log(ts)

const user = "DJ123";

//Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Homepage would go here, but not part of this assignment
app.get('/', function(req, res) {
    res.render('pages/index.ejs', {
        username: user,
        userid: 123,
        timeslots: null
    });
});

//Index page
app.get('/index/:uid', function(req, res) {
    
    //Get current timeslots for user
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const userId = req.params.uid;
    const timeslots = jsonData.filter(obj => userId == obj.uid && !obj.done);

    res.render('pages/index.ejs', {
        username: user,
        userid: userId,
        timeslots: timeslots
    });
});

app.get('/manage/:uid/:playid', function(req, res){

    //Get playlist info
    const userid = req.params.uid;
    const playid = req.params.playid;

    //Get current timeslot
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const timeslot = jsonData.find(obj => userid == obj.uid && playid == obj.tsid);

    //Get old timeslots for user
    const pastslots = jsonData.filter(obj => userid == obj.uid && obj.done);

    res.render('pages/manage.ejs', {
        username: user,
        userid: userid,
        playlistid: playid,
        timeslot: timeslot,
        pastTimeslots: pastslots
    });
})

//About page
app.get('/playlist/:uid/:play1/:play2', function(req, res) {
    console.log("Playlist page");

    //Get user id
    const userid = req.params.uid;
    const playlist1id = req.params.play1;
    const playlist2id = req.params.play2;

    //Get playlist 2 info
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const timeslot = jsonData.find(obj => userid == obj.uid && obj.tsid == playlist2id);

    res.render('pages/playlist.ejs', {
        username: user,
        userid: userid,
        play1: playlist1id,
        timeslot: timeslot
    });
});

app.listen(8080);
console.log('Server is listening on port 8080');