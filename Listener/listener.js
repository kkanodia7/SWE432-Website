var audioBar;
var audioPlayer;
var audioLabel;
var audioFavBtn;
var searchForm;
var searchInput;
var currentPage;

function playSong(button) {
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName('td');
    const artist = cells[1].innerText;
    const song = cells[2].innerText;
    const genre = cells[3].innerText;
    const tbody = row.parentNode;
    localStorage.setItem('playing', 'true');
    localStorage.setItem('song', song);
    localStorage.setItem('artist', artist);
    localStorage.setItem('genre', genre);
    if (tbody.id == "FavoriteSongs") {
      localStorage.setItem('favorited', 'true');
    } else {
      localStorage.setItem('favorited', 'false');
    }
    displaySongInfoInPlayer(song, artist);
    // Put actual song into audio player
}

function displaySongInfoInPlayer(song, artist) {
    audioBar.style.display = 'flex';
    // audioLabel.innerHTML = '';
    audioLabel.innerHTML = '<i><b>Playing:</b> ' + song + ' - ' + artist + '</i>';
    audioFavBtn.innerText = 'Favorite';
    if (localStorage.getItem('favorited') == 'true') {
      audioFavBtn.innerText = 'Unfavorite';
    }
}

function closePlayer() {
    // Stop or pause currently-playing song
    audioBar.style.display = 'none'
    localStorage.clear()
}

// When user clicks "Remove" button in table row
function removeEntry(button) {
    const confirmed = confirm("Remove this entry?");
    if (confirmed) {
        const row = button.parentNode.parentNode;
        const rowNum = parseInt(row.firstElementChild.innerText);
        const tbody = row.parentNode;
        if (tbody.id == "FavoriteSongs" || tbody.id == "RecommendedSongs") {
            const songName = row.cells[2].textContent;
            removeSongFromDatabase(tbody.id, songName);
        }
        tbody.removeChild(row);
        const rows = tbody.getElementsByTagName('tr');
        for (let i = rowNum - 1; i < rows.length; i++) {
          rows[i].firstElementChild.innerText = i + 1;
        }
    }
}


function removeSongFromDatabase(playlist, songName) {
    // Send an HTTP request to server to delete the song
    fetch(`/api/playlists/${playlist}/songs/${songName}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to delete song: ${response.status}`);
      }
    })
    .catch(error => {
      console.error('Error deleting song:', error);
    });
  }


function addToFavorites(button) {
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName('td');
    const table = row.parentNode.parentNode;
    if (table.id == 'rec-songs') {
        const songArtist = cells[1].textContent;
        const songName = cells[2].textContent;
        const songGenre = cells[3].textContent;

        let newFavSong = {
            name: songName,
            artist: songArtist,
            genre: songGenre
            // Other information here
        };
        if (button.innerText == "Favorite") {
          addSongToDatabase("FavoriteSongs", newFavSong);
          removeSongFromDatabase("RecommendedSongs", songName);
          button.innerText = "Favorited! (Undo)";
        } else {
          addSongToDatabase("RecommendedSongs", newFavSong);
          removeSongFromDatabase("FavoriteSongs", songName);
          button.innerText = "Favorite";
        }

    } else if (table.id == 'rec-djs') {
        const djName = cells[1].innerText;
        let newFavDJ = {
            dj: djName
            // Other information here
        };
        if (button.innerText == "Favorite") {
          button.innerText = "Favorited! (Undo)";
        } else {
          button.innerText = "Favorite";
        }
    }
}

function favoriteFromPlayer() {
  const songArtist = localStorage.getItem('artist');
  const songName = localStorage.getItem('song');
  const songGenre = localStorage.getItem('genre');
  let newSong = {
    name: songName,
    artist: songArtist,
    genre: songGenre
  };
  // Remove song from favorites
  if (localStorage.getItem('favorited') == 'true') {
    localStorage.setItem('favorited', 'false')
    audioFavBtn.innerText = "Favorite"
    removeSongFromDatabase("FavoriteSongs", songName);
    addSongToDatabase("RecommendedSongs", newSong)
  }
  // Add song to favorites
  else {
    localStorage.setItem('favorited', 'true')
    audioFavBtn.innerText = "Unfavorite"
    addSongToDatabase("FavoriteSongs", newSong);
    removeSongFromDatabase("RecommendedSongs", songName);
  }
  location.reload();

}

function addSongToDatabase(playlist, song) {
    fetch(`/api/playlists/${playlist}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(song)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to add song: ${response.status}`);
        }
      })
      .catch(error => {
        console.error('Error adding song:', error);
      });
}


function keydownFunc(event) {
    // If user presses spacebar
    if (audioBar.style.display === 'flex') {
        if (event.keyCode === 32 || event.key === ' ') {
            // Stop the default action from occurring (scrolling the page down)
            event.preventDefault();
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        }
        // If user presses escape
        else if (event.keyCode === 27 || event.key === 'Escape') {
            closePlayer();
        }
    }
}

function search(event) {
    // Prevent default form submission (appending to URL)
    event.preventDefault();
    const searchText = searchInput.value;
    if (searchText == '') {
        alert("Please enter a valid search!")
    } else {
        // Query database to look for songs or DJs that match search terms
    }
}

function fillPlaylists() {
    if (currentPage === 'index') {
      fetchAndPopulatePlaylist('FavoriteSongs');
      fetchAndPopulatePlaylist('RecommendedSongs');
    } else if (currentPage === 'favorites') {
      fetchAndPopulatePlaylist('FavoriteSongs');
    //   fetchAndPopulatePlaylist('FavoriteDJs');
    } else if (currentPage === 'recommended') {
      fetchAndPopulatePlaylist('RecommendedSongs');
    //   fetchAndPopulatePlaylist('RecommendedDJs');
    }
}



// Function to fetch and populate a playlist
function fetchAndPopulatePlaylist(playlist) {
    fetch(`/api/playlists/${playlist}/songs`)
      .then(response => response.json())
      .then(songs => {
        populateSongsTable(songs, playlist);
      })
      .catch(error => {
        console.error(`Error fetching songs for ${playlist}:`, error);
      });
}
  
// Function to populate a table with songs
function populateSongsTable(songs, playlist) {
    const tableBody = document.getElementById(playlist);
    tableBody.innerHTML = '';
    // For index, stop after first 3
    limit = songs.length;
    if (currentPage == "index" && songs.length > 3) {
        limit = 3;
    }
    for (let i = 0; i < limit; i++) {
        const song = songs[i];
    
        const row = tableBody.insertRow();
        const numCell = row.insertCell(0);
        const artistCell = row.insertCell(1);
        const nameCell = row.insertCell(2);
        const genreCell = row.insertCell(3);
        const optionsCell = row.insertCell(4);
    
        numCell.textContent = i+1;
        nameCell.textContent = song.name;
        artistCell.textContent = song.artist;
        genreCell.textContent = song.genre;
        if (currentPage == "index") {
            optionsCell.innerHTML = 
            `<button onclick="playSong(this)">Play</button>
            <button>Details</button>`;
        } else if (playlist == "FavoriteSongs") {
            optionsCell.innerHTML = 
            `<button onclick="playSong(this)">Play</button>
            <button>Details</button>
            <button onclick="removeEntry(this)">Remove</button>`;
        } else if (playlist == "RecommendedSongs") {
            optionsCell.innerHTML = 
            `<button onclick="playSong(this)">Play</button>
            <button>Details</button>
            <button onclick="addToFavorites(this)">Favorite</button>
            <button onclick="removeEntry(this)">Remove</button>`;
        }
    }
}


document.addEventListener("DOMContentLoaded", function() {
    audioBar = document.getElementById("audio-player");
    audioPlayer = document.getElementById("audio-control");
    audioLabel = document.getElementById("audio-label");
    audioFavBtn = document.getElementById("audio-fav-btn");
    searchForm = document.getElementById("search-form");
    searchInput = document.getElementById("search-bar");
    currentPage = document.body.dataset.page;
    document.addEventListener('keydown', keydownFunc);
    searchForm.addEventListener('submit', search);
    fillPlaylists();
    if (localStorage.getItem('playing') == 'true') {
        displaySongInfoInPlayer(localStorage.getItem('song'), localStorage.getItem('artist'))
    }
});