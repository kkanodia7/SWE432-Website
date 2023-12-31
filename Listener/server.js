var express = require('express');
var mongoose = require('mongoose');
var app = express();
app.use(express.json());


// Database setup
mongoose.connect('mongodb://127.0.0.1:27017/listenerdb');
const Schema = mongoose.Schema;
const songSchema = new Schema({
    name: String,
    artist: String,
    genre: String,
});
const playlistSchema = new Schema({
    tsid: Number,
    uid: Number,
    date: String,
    start: String,
    end: String,
    done: Boolean,
    name: String,
    desc: String,
    songs: [songSchema],
});
const Playlist = mongoose.model('Playlist', playlistSchema);
// End of database setup


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


// Database routes

// Get all songs from a playlist
app.get('/api/playlists/:playlistName/songs', async (req, res) => {
    try {
      const { playlistName } = req.params;
      const playlist = await Playlist.findOne({ name: playlistName });
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      res.json(playlist.songs); // Send the songs array of the playlist
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new song to a playlist
app.post('/api/playlists/:playlistName/songs', async (req, res) => {
    try {
      const { playlistName } = req.params;
      const playlist = await Playlist.findOne({ name: playlistName });
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      // req.body contains the new song object
      playlist.songs.push(req.body);
      const updatedPlaylist = await playlist.save();
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a song from a playlist
app.delete('/api/playlists/:playlistName/songs/:songName', async (req, res) => {
    try {
      const { playlistName, songName } = req.params;
      const playlist = await Playlist.findOne({ name: playlistName });
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      const songIndex = playlist.songs.findIndex(song => song.name === songName);
      if (songIndex === -1) {
        return res.status(404).json({ error: 'Song not found in the playlist' });
      }
      playlist.songs.splice(songIndex, 1);
      const updatedPlaylist = await playlist.save();
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// End of database routes



// Favorites Playlist
// const songs = [
//     { name: 'Firework', artist: 'Katy Perry', genre: 'Dance-Pop' },
//     { name: 'Virginia Beach', artist: 'Drake', genre: 'Hip-Hop' },
//     { name: 'Flowers', artist: 'Miley Cyrus', genre: 'Disco-Pop' },
//   ];
  
//   // Create a playlist with the songs
//   const playlist = new Playlist({
//     tsid: 0,
//     uid: 0,
//     date: '',
//     start: '',
//     end: '',
//     done: true,
//     name: 'FavoriteSongs',
//     desc: 'Songs that you have added to your favorites',
//     songs: songs
//   });
  
//   // Save the playlist to the database
//   playlist.save()
//     .then(savedPlaylist => {
//       console.log('Playlist with songs created and saved:', savedPlaylist);
//     })
//     .catch(error => {
//       console.error('Error saving playlist:', error);
//     });

// Recommended Playlist
// const songs = [
//     { name: 'Cruel Summer', artist: 'Taylor Swift', genre: 'Synth-Pop' },
//     { name: 'California Gurls', artist: 'Katy Perry', genre: 'Disco-Pop' },
//     { name: 'a m a r i', artist: 'J. Cole', genre: 'Hip-Hop' },
//   ];
  
//   // Create a playlist with the songs
//   const playlist = new Playlist({
//     tsid: 0,
//     uid: 0,
//     date: '',
//     start: '',
//     end: '',
//     done: true,
//     name: 'RecommendedSongs',
//     desc: 'Songs recommended to you based on your favorites',
//     songs: songs
//   });
  
//   // Save the playlist to the database
//   playlist.save()
//     .then(savedPlaylist => {
//       console.log('Playlist with songs created and saved:', savedPlaylist);
//     })
//     .catch(error => {
//       console.error('Error saving playlist:', error);
//     });



app.listen(8080);
console.log('Server is listening on port 8080');