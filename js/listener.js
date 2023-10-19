var audioBar;
var audioPlayer;
var audioLabel;
var searchForm;
var searchInput;

function playSong(button) {
    audioBar.style.display = 'flex';
    audioLabel.innerHTML = '';
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName('td');
    const artist = cells[1].innerText;
    const song = cells[2].innerText;
    audioLabel.innerHTML = '<i><b>Playing:</b> ' + song + ' - ' + artist + '</i>'
    // Put actual song into audio player
}

function closePlayer() {
    // Stop or pause currently-playing song
    audioBar.style.display = 'none'
}

// When user clicks "Remove" button in table row
function removeEntry(button) {
    const confirmed = confirm("Remove this entry?");
    if (confirmed) {
        const row = button.parentNode.parentNode;
        const rowNum = parseInt(row.firstElementChild.innerText);
        const tbody = row.parentNode;
        tbody.removeChild(row);
        const rows = tbody.getElementsByTagName('tr');
        for (let i = rowNum - 1; i < rows.length; i++) {
          rows[i].firstElementChild.innerText = i + 1;
        }
    }
}

function addToFavorites(button) {
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName('td');
    const table = row.parentNode.parentNode;
    if (table.id == 'rec-songs') {
        const songArtist = cells[1].innerText;
        const songName = cells[2].innerText;
        let newFavSong = {
            artist: songArtist,
            song: songName
            // Other information here
        };
    } else if (table.id == 'rec-djs') {
        const djName = cells[1].innerText;
        let newFavDJ = {
            dj: djName
            // Other information here
        };
    }
    button.innerText = "Favorited!"
    // Send objects to server / database as necessary
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


document.addEventListener("DOMContentLoaded", function() {
    audioBar = document.getElementById("audio-player");
    audioPlayer = document.getElementById("audio-control");
    audioLabel = document.getElementById("audio-label");
    searchForm = document.getElementById("search-form");
    searchInput = document.getElementById("search-bar")
    document.addEventListener('keydown', keydownFunc);
    searchForm.addEventListener('submit', search);
});