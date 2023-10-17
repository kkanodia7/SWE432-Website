var audioBar;
var audioPlayer;

function playSong() {
    audioBar.style.display = 'flex';
    // Put actual song into audio player
}

function closePlayer() {
    // Stop or pause currently-playing song
    audioBar.style.display = 'none'
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


document.addEventListener("DOMContentLoaded", function() {
    audioBar = document.getElementById("audio-player");
    audioPlayer = document.getElementById("audio-control");
    document.addEventListener('keydown', keydownFunc);
});