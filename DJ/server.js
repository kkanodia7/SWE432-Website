const fs = require('fs');
const path = require('path');
var express = require('express');
const { timeStamp } = require('console');
var app     = express();

//Database
const mongoose = require('mongoose');

//Session storing
const session = require('express-session');
const { doesNotMatch } = require('assert');
app.use(session({
    secret: 'MySecretCode',
    saveUninitialized: true,
    resave: true,
    cookie: {
        expires: false  //Remains only for duration of session
    }
  }));
  
//const MongoStore = require('connect-mongo');

//Mongo stuff, setting up schemas
mongoose.connect('mongodb://127.0.0.1:27017/swe432');

//DJ model
const DJ = mongoose.model('DJ', {
    uid: Number,
    username: String,
    password: String
});

//Timeslot model
const Timeslot = mongoose.model('Timeslot', {
    tsid: Number,
    uid: Number,
    date: String,
    start: String,
    end: String,
    done: Boolean,
    title: String,
    desc: String,
    songs: [{
            title: String,
            artist: String
        }]
});

//Initial setup, commented out to avoid repetition in db entries
/*const pastSlot = new Timeslot({
    tsid: 3,
    uid: 123,
    date: '10/18/2023',
    start: '9:00pm',
    end: '11:00pm',
    done: true,
    title: 'Night Mix',
    desc: 'Songs to play for a chill night',
    songs: [{
            title: 'Virginia Beach',
            artist: 'Drake'
        },
        {
            title: 'Cruel Summer',
            artist: 'Taylor Swift'
        }]
});
pastSlot.save();*/

/*
main().catch(err => console.log(err));

async function main() { 
    await mongoose.connect('mongodb://127.0.0.1:27017/swe432');
    
    const djSchema = new mongoose.Schema({
        uid: Number,
        username: String,
        password: String
    });

    const timeslotSchema = new mongoose.Schema({
        tsid: Number,
        uid: Number,
        date: String,
        start: String,
        end: String,
        done: Boolean,
        title: String,
        desc: String,
        songs: [{
                title: String,
                artist: String
            }]
    });

    var DJ = mongoose.model('DJ', djSchema);
    var Timeslot = mongoose.model('Timeslot', timeslotSchema);

    
    const sampleDJ = new DJ({
        uid: 123,
        username: 'dj123',
        password: 'pass' 
    });
    await sampleDJ.save();

    const sampleTimeslot = new Timeslot({
        tsid: 1,
        uid: 123,   //associated with dj #123
        date: '11/24/2023',
        start: '1:00pm',
        end: '3:00pm',
        done: false,
        title: 'Afternoon Tunes',
        desc: 'Songs to play for a relaxing afternoon',
        songs: [{
                title: 'Flowers',
                artist: 'Miley Cyrus'
            },
            {
                title: 'Firework',
                artist: 'Katy Perry'
            },
            {
                title: 'Virginia Beach',
                artist: 'Drake'
            },
            {
                title: 'Cruel Summer',
                artist: 'Taylor Swift'
            }
        ]
    });
    await sampleTimeslot.save();

    const djs = await DJ.find();
    const timeslots = await Timeslot.find();
    console.log(djs);
    console.log(timeslots);

}
*/

//Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Log out function
app.get('/logout', function (req, res) {
    
    //Reset session info
    req.session.userId = "";
    req.session.username = "";

    res.render('pages/index.ejs', {
        userid: "",
        username: "",
        timeslots: []
    });
});

//After theoretical login, session token passed:
app.get('/index', function(req, res) {
    
    //Check if session persisted
    if (req.session.userId != null && req.session.userId != ""){
        console.log('entered if');
        const uid = req.session.userId;
        const username = req.session.username;

        //Get timeslots
        getTimeslots(uid, false).then(timeslots => {
            res.render('pages/index.ejs', {
                userid: uid,
                username: username,
                timeslots: timeslots
            })
        });
    }
    //No session, display nothing
    else {
        res.render('pages/index.ejs', {
            userid: "",
            username: "",
            timeslots: []
        });
    }
    
});

async function getTimeslots(uid, done){
    const timeslots = await Timeslot.find({'uid': uid, 'done': done});

    return timeslots;
}

async function getTimeslot(tsid){
    const ts = await Timeslot.findOne({'tsid': tsid});

    return ts;
}

async function getUsername(uid){
    const userName = await DJ.findOne({'uid': uid});
    return userName.username;
}

//User has logged in, session passed via URL
app.get('/index/:uid', function(req, res) {
    
    //Get username via session id
    getUsername(req.params.uid).then(username => {
        
        //Store session info
        const userId = req.params.uid;
        req.session.userId = userId;
        req.session.username = username;
    
        //Get current timeslots for user
        getTimeslots(userId, false).then(timeslots=>{
            
            //Check if user has timeslots
            if (timeslots == undefined || timeslots == null){
                timeslots = [];
            }
    
           //Render page
            res.render('pages/index.ejs', {
                username: username,
                userid: userId,
                timeslots: timeslots
            });
        });
    });
});

app.get('/manage/:uid/:playid', function(req, res){

    //Get playlist info
    const userid = req.params.uid;
    const playid = req.params.playid;

    //Get current timeslot
    getTimeslot(playid).then(timeslot => {
        
        //Get old timeslots for user
        getTimeslots(userid, true).then(pastslots => {
            
            //Get username
            getUsername(userid).then(user => {
            
                res.render('pages/manage.ejs', {
                    username: user,
                    userid: userid,
                    playlistid: playid,
                    timeslot: timeslot,
                    pastTimeslots: pastslots,
                    showdialog: 'hidden',
                    recentlyremoved: []
                });
            });
        });
    });


})

//About page
app.get('/playlist/:uid/:play1/:play2', function(req, res) {

    //Get user id
    const userid = req.params.uid;
    const playlist1id = req.params.play1;
    const playlist2id = req.params.play2;

    //Get playlist 2 info
    getTimeslot(playlist2id).then(timeslot => {
        
        //Get username
        getUsername(userid).then(user => {
            res.render('pages/playlist.ejs', {
                username: user,
                userid: userid,
                play1: playlist1id,
                play2: playlist2id,
                timeslot: timeslot
            });
        });
    });
});

//Form responses
app.post('/addsongs/:uid/:play1/:play2', function(req, res) {
    const playlist1id = req.params.play1;
    const playlist2id = req.params.play2;

    const checked = req.body;
    const checkedary = [];
    for (let i in checked){
        checkedary.push([checked[i]]);
    }

    //Get play1
    getTimeslot(playlist1id).then(play1 => {
        
        //Get play2
        getTimeslot(playlist2id).then(play2 => {
            
            //Get all songs in play2
            const songs = play2.songs;

            for (let i = 0; i < checkedary.length; i++){
                console.log(songs[i]);
                if (checkedary[i] == '1'){
                    let toAdd = {title: songs[i].title, artist: songs[i].artist};
                    play1.songs.push(toAdd);
                }
            }

            //Update database
            play1.save();
        });
    });
});

app.post('/remove/:tid/:title/:artist', function(req, res) {
    //Get params
    const tid = req.params.tid;
    const title = req.params.title;
    const artist = req.params.artist;
    

    //Get playlist
    getTimeslot(tid).then(playlist => {
        //Get user id
        const userId = playlist.uid;

        //Find and remove song
        for (let i in playlist.songs){
            if (playlist.songs[i].title == title && playlist.songs[i].artist == artist){
                playlist.songs.splice(i, 1);
                break;
            }
        }

        //Get username
        getUsername(playlist.uid).then(user => {
                
            //Write change
            playlist.save().then(done => {
                //Get current timeslots
                getTimeslots(userId, false).then(timeslots => {
                    
                    //Update view
                    res.render('pages/index.ejs', {
                        username: user,
                        userid: userId,
                        timeslots: timeslots
                    });
                });
            });
        });
    });
});

app.post('/removesongs/:uid/:tsid', function(req, res){
    //Get params
    const userid = req.params.uid;
    const tsid = req.params.tsid;

    //Get username
    getUsername(userid).then(user => {
        //Get playlist to remove from
        getTimeslot(tsid).then(playlist => {
        
            //Get past timeslots
            getTimeslots(userid, true).then(pastslots => {
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
                        recentlyremoved.push({title: songs[i].title, artist: songs[i].artist});
                        songs.splice(i, 1);
                    }
                }

                //Write changes
                playlist.save().then(done => {
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
            });
        });
    });
});

app.post('/undo/:tsid/:uid/:rr', function(req, res){
    const tsid = req.params.tsid;
    const uid = req.params.uid;
    const recentlyremoved = JSON.parse(decodeURIComponent(req.params.rr));

    //Get username
    getUsername(uid).then(user => {
        //Get playlist to re-add to
        getTimeslot(tsid).then(playlist => {
            
            //Get past timeslots
            getTimeslots(uid, true).then(pastslots => {
                const songs = playlist.songs;

                //Re-add songs
                for (let song of recentlyremoved){
                    songs.push(song);
                }

                //write changes
                playlist.save().then(done => {
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
            });
        });
    });
});

app.post('/editinfo/:uid/:tsid/', function(req, res){
    const uid = req.params.uid;
    const tsid = req.params.tsid;
    const title = req.body.title;
    const desc = req.body.desc;

    //Get username
    getUsername(uid).then(user => {
        
        //Get playlist to change
        getTimeslot(tsid).then(playlist => {

            //Get past timeslots
            getTimeslots(uid, true).then(pastslots => {
                
                //Alter title/desc field
                playlist.title = title;
                playlist.desc = desc;

                //Write changes
                playlist.save().then(done => {
                    
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
                })
            });
        });
    });
});

app.listen(8080);
console.log('Server is listening on port 8080');