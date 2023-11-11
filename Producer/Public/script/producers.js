function extend() {
    var x = document.getElementById("userLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}
// This function displays a popup message about a song's addition to the trend page
function addToTrend(songElement, artistElement) {
    // Display the popup message
    // Get song name and artist from their respective elements
    let songName = songElement.textContent;
    let artistName = artistElement.textContent;

    // Display the popup message with song and artist names
    alert("Adding the song \"" + songName + "\" by " + artistName + " to the trend page.");

    // Add the song to the trend page not funtional at the moment purpose to demonstate inline event handler
    // logging to the console. DOM Content Load
    console.log("Song \"" + songName + "\" by " + artistName + " added to trend page.");
}

// This function displays a confirmation message when feedback is sent to a selected DJ
function confirmFeedbackSubmission() {
    // Get the selected DJ's name from the dropdown
    const selectedDJ = document.getElementById("djSelect").options[document.getElementById("djSelect").selectedIndex].text;

    // Display the confirmation alert
    alert("Feedback message has been sent to " + selectedDJ + ".");

    // Need to update this section of code when the DB is set
    // Currently set to return false to prevent form submissiong
    return false;
}
// This function performs a search by sending a request to the server need to be updated in iteration 4
function performSearch() {
     // Get the query from the search bar input
    var query = document.getElementById('search-bar').value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'path_to_server/search.php?q=' + encodeURIComponent(query), true);

    xhr.onload = function () {
        if (this.status == 200) {
            // Update the site body with search results
            document.querySelector('.sitebody').innerHTML = this.responseText;
        }
    }

    xhr.send();
}
// This function removes a table row when the associated button is clicked
function removeRow(event) {
    const btn = event.target.closest("button");
    const row = btn.closest("tr");
    row.remove();
}
//DOM contentloaded event listner to the document that runs when content has been fully loaded
//
document.addEventListener("DOMContentLoaded", function () {
    // Get all play/pause buttons, the edit button, and the start and end time inputs
    const playPauseButtons = document.querySelectorAll(".playPauseButton");
    const editButton = document.querySelector('.timeslot button');
    const startTimeInput = document.getElementById("startTime");
    const endTimeInput = document.getElementById("endTime");
    let isEditing = false;
    // Event listener to the edit button
    editButton.addEventListener('click', function() {
        isEditing = !isEditing; // toggle the editing state
        
        if (isEditing) {
            // If we are editing the start time and end time, remove read-only from inputs and change 
            startTimeInput.removeAttribute('readonly');
            endTimeInput.removeAttribute('readonly');
           
        } else {
            // When finished editing make the inputs read-only again
            startTimeInput.setAttribute('readonly', true);
            endTimeInput.setAttribute('readonly', true);
            
        }
    });
    // Event listner to the play/pause button
    playPauseButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Play/pause image toggle
            const playPauseImage = button.querySelector(".playPauseImage");
            if (playPauseImage.getAttribute("alt") === "Play Icon") {
                playPauseImage.setAttribute("src", "../../img/line-md_pause-transition.svg");
            } else {
                playPauseImage.setAttribute("src", "../../img/line-md_play-to-pause-transition.svg");
            }

            // Fetch song and artist name and set to audio player
            const row = button.closest("tr");
            const artist = row.querySelector("td:nth-child(2)").textContent;
            const song = row.querySelector("td:nth-child(3)").textContent;
            const playerInfo = document.querySelector("#audio-player p");
            playerInfo.innerHTML = `<i><b>Playing:</b> ${song} - ${artist}</i>`;
        });
    });
    // Event listener to each button to remove a row in this case is the song 
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(btn => {
        btn.addEventListener("click", removeRow);
    });

    // Calendar logic from second code
    const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".iconsCalendar span");

    let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

    const months = ["January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];

    // This is the logic that renders the calendar view based on the month              
    const renderCalendar = () => {
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
        let liTag = "";

        for (let i = firstDayofMonth; i > 0; i--) {
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }

        for (let i = 1; i <= lastDateofMonth; i++) {
            let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                        && currYear === new Date().getFullYear() ? "active" : "";
            liTag += `<li class="${isToday}" data-date="${i}" data-month="${currMonth}" data-year="${currYear}">${i}</li>`;
        }

        for (let i = lastDayofMonth; i < 6; i++) {
            liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
        }
        currentDate.innerText = `${months[currMonth]} ${currYear}`;
        daysTag.innerHTML = liTag;
        addDateClickEvent();
    }
    renderCalendar();

    // using the cheveron button to switch between the prev and next month
    prevNextIcon.forEach(icon => { // getting prev and next icons
        icon.addEventListener("click", () => { // adding click event on both icons
            // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
    
            if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
                // creating a new date of current year & month and pass it as date value
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear(); // updating current year with new date year
                currMonth = date.getMonth(); // updating current month with new date month
            } else {
                date = new Date(); // pass the current date as date value
            }
            renderCalendar(); // calling renderCalendar function
        });
    });
    // allows to click any inactive dates on the calendar 
    function addDateClickEvent() {
        document.querySelectorAll(".days li").forEach(day => {
            day.addEventListener("click", function() {
                // Check if the clicked date is not an inactive date
                if(!this.classList.contains("inactive")) {
                    // Remove the active class from any other date elements
                    document.querySelectorAll(".days li.active").forEach(activeDate => {
                        activeDate.classList.remove("active");
                    });

                    // Add the active class to the clicked date element
                    this.classList.add("active");

                    // Update the date object to reflect the clicked date
                    date = new Date(this.getAttribute("data-year"), this.getAttribute("data-month"), this.getAttribute("data-date"));
                }
            });
        });
    }
});
