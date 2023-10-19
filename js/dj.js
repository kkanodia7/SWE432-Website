window.addEventListener("DOMContentLoaded", (e) => {
    //Put everything here
    console.log("DOM Content Loaded!");
    
    //Handler to validate if any boxes are checked in a form
    //If not, stops submission and highlights boxes
    let validateForm = function (e, formID){
        //Get the form
        let thisForm = document.getElementById(formID);

        //Get all fields from form
        let checkboxes = thisForm.getElementsByClassName("checkbox");
        let unchecked = new Array();
        let allChecked = new Array();

        //Iterate through checkboxes
        for (let checkbox of checkboxes){
            
            //Get all unchecked boxes
            if (!(checkbox.checked)){
                unchecked.push(checkbox);
            }
            //Get all checked boxes
            else {
                allChecked.push(checkbox);
            }
        }

        //Report invalid form
        if (allChecked.length == 0){
            window.alert("You must select at least one song.")
            e.preventDefault();

            //Make all checkboxes red
            for (let box of unchecked){
                box.style.outline = "2px solid red";
            }
            return false;
        }

        //Report valid form
        else {
            //Clear formatting changes
            for (let box of checkboxes){
                box.style.outline = "none";
            }

            //If manage page, remove selected songs
            if (formID == "current-timeslot-form"){
                removeElements(formID, allChecked);
                return false;
            }

            //If adding songs, just report success
            else if (formID == "past-playlist-form"){
                window.alert("Your selected songs have been added.");
                return true;
            }

            //In case future forms are added, more else-ifs can be placed before here
            else{
                return;
            }
        }
    }

    //Handler to Remove the elements selected from checkboxes
    let removeElements = function(formID, allChecked){
        entireForm = document.getElementById(formID);
        entireForm.reset();
        let table = entireForm.children.item(0).children.item(1);

        //Save previous table state in case of undo
        let removed = new Array();
                
        //Iterate through checked elements and remove them
        for (let checked of allChecked){
            //Remove corresponding table row
            let row = checked.parentElement.parentElement;
            row.remove();

            //Saving removed elements in case of undo
            removed.push(row);
        }

        //Update index for remaining elements
        let tableBody = document.getElementById("timeslot-body");
        let rows = tableBody.children;
        let count = restoreIndices(rows);
        

        //Show confirmation dialog
        let dialog = document.getElementById("dialog-wrapper");
        dialog.style.visibility = 'visible';

        let undoButton = document.getElementById("dialog-undo");
        undoButton.addEventListener("click", (e) => {
            while (removed.length > 0){
                let toAdd = removed.pop();
                toAdd.children.item(0).textContent = count;
                tableBody.appendChild(toAdd);
                count++;
            }
            window.location.reload();
        });
    }

    //Handler to remove a single element whose corresponding button was clicked
    let removeElement = function(e){
        let row = e.target.parentElement.parentElement;
        let rows = e.target.parentElement.parentElement.parentElement.children;
        row.remove();
        restoreIndices(rows);
    }

    let playSong = function(e){
        e.stopPropagation();

        let row = e.target.parentElement.parentElement;
        let childNodes = row.childNodes;

        //Get name of song
        let songName = childNodes.item(5).textContent;

        //Get artist name
        let artistName = childNodes.item(3).textContent;

        //This is where we would get the info/files from the database, 
        //but that does not exist yet, so I am unable to play a song yet.

        //Get player
        let player = document.getElementById("audio-player");
        let playerText = document.getElementById("player-text");

        playerText.innerHTML = "<b>Now Playing:</b> " + artistName + " - " + songName
    }

    //Handler to make form visible
    function populateForm(e, playlist) {
        let title = document.getElementById('timeslot-title').textContent;
        let desc = document.getElementById('timeslot-desc').textContent;

        document.getElementById('edit-title').value = title;
        document.getElementById('edit-desc').value = desc;

        let playlistInfo = {
            currentTitle: title,
            currentDesc: desc
        };

        //Create listeners for each field
        let fields = [document.getElementById('edit-title'), 
                      document.getElementById('edit-desc')];
        fields.forEach((field) => {
            field.addEventListener("blur", (e) => {
                if (field.value == ""){
                    field.style.outline = "2px solid red";
                }
                else{
                    field.style.outline = "none";
                }
            });
        });

        //Create listeners for submit
        let form = document.getElementById("playlist-form");
        form.addEventListener("submit", (e) => {
            playlistInfo.currentTitle = document.getElementById('edit-title').value;
            playlistInfo.currentDesc = document.getElementById('edit-desc').value;
            
            if (playlistInfo.currentTitle == "" || playlistInfo.currentDesc == ""){
                window.alert("Fields cannot be left blank.");
                e.preventDefault();
            }
            else {
                //Create new playlist title
                const hea = document.createElement("h2");
                const node = document.createTextNode(playlistInfo.currentTitle);
                hea.appendChild(node);

                //Create new playlist description
                const par = document.createElement("p");
                const node2 = document.createTextNode(playlistInfo.currentDesc);
                par.appendChild(node2);
                
                //Alter playlist title
                document.getElementById('timeslot-title').replaceWith(hea);

                //Alter playlist description
                document.getElementById('timeslot-desc').replaceWith(par);

                //Shoo away menu after use
                form.style.display= "none";
            }
        });

    }

    //Helper function to keep playlist item indices in order 1-n after removal
    let restoreIndices = function(rows){
        let count = 1;
        for (let row of rows){
            let index = row.children.item(0);
            index.textContent = count;
            count++;
        }
        return count;
    }

    //Event listener for adding songs form
    let pastPlaylistForm = document.getElementById("past-playlist-form");
    if (pastPlaylistForm){
        pastPlaylistForm.addEventListener('submit', (function(param){
            return function (e) {
                validateForm(e, param);
            };
        }) ("past-playlist-form"));
    }

    //Event listener for removing songs form
    let currentTimeslotForm = document.getElementById("current-timeslot-form");
    if (currentTimeslotForm){
        currentTimeslotForm.addEventListener('submit', (function(param){
            return function (e) {
                validateForm(e, param);
            };
        }) ("current-timeslot-form"));
    }

    //Event listener for clicking singular remove button
    let removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(function(button) {
        button.addEventListener("click", (function(param) {
            return function(e) {               
                removeElement(e, param);
            };
        }) (button));
    });

    //Event listener for clicking play button
    let playButtons = document.querySelectorAll(".play-btn");
    playButtons.forEach(function(button) {
        button.addEventListener("click", (function(param) {
            return function(e) {               
                playSong(e, param);
            };
        }) (button));
    });

    //Event listener for opening the playlist edit menu
    let showFormButton = document.getElementById('edit-form-toggle');
    if (showFormButton){
        showFormButton.addEventListener("click", (function() {
            return function(e) {
                populateForm(e);
            };
        }) ());
    }
});