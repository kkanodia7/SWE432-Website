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
    name: String,
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



// Define song objects
// const songs = [
//     { name: 'Song 0', artist: 'Artist 1', genre: 'Genre 1' },
//     { name: 'Song 1', artist: 'Artist 2', genre: 'Genre 2' },
//     { name: 'Song 2', artist: 'Artist 3', genre: 'Genre 3' },
//     { name: 'Song 3', artist: 'Artist 1', genre: 'Genre 1' },
//     { name: 'Song 4', artist: 'Artist 2', genre: 'Genre 2' },
//   ];
  
//   // Create a playlist with the songs
//   const playlist = new Playlist({
//     name: 'FavoriteSongs', // Replace with the playlist name
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