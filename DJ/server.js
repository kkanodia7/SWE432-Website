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

const user = "DJ123";

//Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Homepage would go here, but not part of this assignment
app.get('/', function(req, res) {
    res.render('pages/index.ejs', {
        username: user,
        userid: 123,
        timeslots: []
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
        pastTimeslots: pastslots,
        showdialog: 'hidden',
        recentlyremoved: []
    });
})

//About page
app.get('/playlist/:uid/:play1/:play2', function(req, res) {

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
        play2: playlist2id,
        timeslot: timeslot
    });
});

//Form responses
app.post('/addsongs/:uid/:play1/:play2', function(req, res) {
    const userid = req.params.uid;
    const playlist1id = req.params.play1;
    const playlist2id = req.params.play2;

    const checked = req.body;
    const checkedary = [];
    for (let i in checked){
        checkedary.push([checked[i]]);
    }

    //Get play1
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const play1 = jsonData.find(obj => userid == obj.uid && obj.tsid == playlist1id);

    //Get all songs in play2
    const play2 = jsonData.find(obj => userid == obj.uid && obj.tsid == playlist2id);
    const songs = play2.songs;

    for (let i = 0; i < checkedary.length; i++){
        if (checkedary[i] == '1'){
            let toAdd = songs[i];
            play1.songs.push(toAdd);
        }
    }

    fs.writeFile('public/timeslots.json', JSON.stringify(jsonData), 'utf8', function(e) {
        if (e) throw e;
        console.log('Done writing');
    });
});

app.post('/remove/:tid/:title/:artist', function(req, res) {
    //Get params
    const tid = req.params.tid;
    const title = req.params.title;
    const artist = req.params.artist;
    

    //Get playlist
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const playlist = jsonData.find(obj => tid == obj.tsid);

    const userId = playlist.uid;
    const timeslots = jsonData.filter(obj => userId == obj.uid && !obj.done);

    //Find and remove song
    for (let i in playlist.songs){
        if (playlist.songs[i].title == title && playlist.songs[i].artist == artist){
            playlist.songs.splice(i, 1);
        }
    }

    //Write change
    fs.writeFile('public/timeslots.json', JSON.stringify(jsonData), 'utf8', function(e) {
        if (e) throw e;
        console.log('Done writing');
    });

    res.render('pages/index.ejs', {
        username: user,
        userid: userId,
        timeslots: timeslots
    });
});

app.post('/removesongs/:uid/:tsid', function(req, res){
    //Get params
    const userid = req.params.uid;
    const tsid = req.params.tsid;

    //Get playlist to remove from
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const playlist = jsonData.find(obj => tsid == obj.tsid && userid == obj.uid);
    const pastslots = jsonData.filter(obj => userid == obj.uid && obj.done);
    let songs = playlist.songs;
    let recentlyremoved = [];

    //Get songs to remove
    const checked = req.body;
    const checkedary = [];
    for (let i in checked){
        checkedary.push([checked[i]]);
    }

    //Look for songs marked for deletion
    for (let i = checkedary.length -1; i >= 0; i--){
        if (checkedary[i] == '1'){
            recentlyremoved.push(songs[i]);
            songs.splice(i, 1);
        }
    }

    //Write changes
    fs.writeFile('public/timeslots.json', JSON.stringify(jsonData), 'utf8', function(e) {
        if (e) throw e;
        console.log('Done writing');
    });

    res.render('pages/manage.ejs', {
        username: user,
        userid: userid,
        playlistid: tsid,
        timeslot: playlist,
        pastTimeslots: pastslots,
        showdialog: 'visible',
        recentlyremoved: encodeURIComponent(JSON.stringify(recentlyremoved))
    });
});

app.post('/undo/:tsid/:uid/:rr', function(req, res){
    const tsid = req.params.tsid;
    const uid = req.params.uid;
    const recentlyremoved = JSON.parse(decodeURIComponent(req.params.rr));

    //Get playlist to re-add to
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const playlist = jsonData.find(obj => tsid == obj.tsid && uid == obj.uid);
    const pastslots = jsonData.filter(obj => uid == obj.uid && obj.done);
    const songs = playlist.songs;

    //Re-add songs
    for (let song of recentlyremoved){
        songs.push(song);
    }

    //Write changes
    fs.writeFile('public/timeslots.json', JSON.stringify(jsonData), 'utf8', function(e) {
        if (e) throw e;
        console.log('Done writing');
    });

    //Reload without dialog
    res.render('pages/manage.ejs', {
        username: user,
        userid: uid,
        playlistid: tsid,
        timeslot: playlist,
        pastTimeslots: pastslots,
        showdialog: 'hidden',
        recentlyremoved: []
    });
});

app.post('/editinfo/:uid/:tsid/', function(req, res){
    const uid = req.params.uid;
    const tsid = req.params.tsid;
    const title = req.body.title;
    const desc = req.body.desc;

    //Get playlist to change
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const playlist = jsonData.find(obj => tsid == obj.tsid && uid == obj.uid);

    //Get pastslots
    const pastslots = jsonData.filter(obj => uid == obj.uid && obj.done);

    //Alter title/desc field
    playlist.title = title;
    playlist.desc = desc;

    //Write changes
    fs.writeFile('public/timeslots.json', JSON.stringify(jsonData), 'utf8', function(e) {
        if (e) throw e;
        console.log('Done writing');
    });

    //Redirect
    res.render('pages/manage.ejs', {
        username: user,
        userid: uid,
        playlistid: tsid,
        timeslot: playlist,
        pastTimeslots: pastslots,
        showdialog: 'hidden',
        recentlyremoved: []
    });
});

app.listen(8080);
console.log('Server is listening on port 8080');