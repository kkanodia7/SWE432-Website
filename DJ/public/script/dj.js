window.addEventListener("DOMContentLoaded", (e) => {
    //Proof of DOM Content Load
    console.log("DOM Content Loaded!");

    //--------------------------------------------------------------------CHECKBOX FORMS
    
    //Event listener for adding songs via checkboxes (calls validateForm)
    let pastPlaylistForm = document.getElementById("past-playlist-form");
    if (pastPlaylistForm){
        pastPlaylistForm.addEventListener('submit', (function(param){
            return function (e) {
                validateForm(e, param);
            };
        }) ("past-playlist-form"));
    }

    //Event listener for removing songs via checkboxes (calls validateForm)
    let currentTimeslotForm = document.getElementById("current-timeslot-form");
    if (currentTimeslotForm){
        currentTimeslotForm.addEventListener('submit', (function(param){
            return function (e) {
                validateForm(e, param);
            };
        }) ("current-timeslot-form"));
    }

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
                if (box.checked){
                    document.getElementById(`${box.id}Hidden`).disabled = true;
                }
            }

            //If manage page, remove selected songs
            if (formID == "current-timeslot-form"){
                //removeElements(formID, allChecked);
                return true;
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
    //let removeElements = function(formID, allChecked){
        //entireForm = document.getElementById(formID);
        //entireForm.reset();
        //let table = entireForm.children.item(0).children.item(1);

        //Save previous table state in case of undo
        //let removed = new Array();
                
        //Iterate through checked elements and remove them
        //for (let checked of allChecked){
        //    //Remove corresponding table row
        //    let row = checked.parentElement.parentElement;
        //    row.remove();

            //Saving removed elements in case of undo
        //    removed.push(row);
        //}

        //Update index for remaining elements
        //let tableBody = document.getElementById("timeslot-body");
        //let rows = tableBody.children;
        //let count = restoreIndices(rows);
        

        //Show confirmation dialog
        //let dialog = document.getElementById("dialog-wrapper");
        //dialog.style.visibility = 'visible';

        
    //}

    //----------------------------------------------------------------------BUTTON EVENTS

    //Event listener for clicking singular remove button
    /*let removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(function(button) {
        button.addEventListener("click", (function(param) {
            return function(e) {               
                removeElement(e, param);
            };
        }) (button));
    });

    //Handler for singular remove button
    let removeElement = function(e){
        let row = e.target.parentElement.parentElement.parentElement;
        let rows = e.target.parentElement.parentElement.parentElement.parentElement.children;
        row.remove();
        restoreIndices(rows);
        
        console.log(e.target.parentElement);
        console.log(e.target.parentElement.action);
    }*/

    //----------------------------------------------------------------------FORM VISIBILITY + TEXT FORMS

    //Event listener to make form visible
    let showFormButton = document.getElementById('edit-form-toggle');
    if (showFormButton){
        showFormButton.addEventListener("click", (function() {
            return function(e) {
                populateForm(e);
            };
        }) ());
    }

    //Handler to make form visible and validate it
    function populateForm(e, playlist) {
        //Get current title/desc info
        let title = document.getElementById('timeslot-title').textContent;
        let desc = document.getElementById('timeslot-desc').textContent;

        //Populate form values
        document.getElementById('edit-title').value = title;
        document.getElementById('edit-desc').value = desc;

        //Create object to store title/desc info
        let playlistInfo = {
            currentTitle: title,
            currentDesc: desc
        };

        //Create listeners for each form field (blur)
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

        //Create listener for submission
        let form = document.getElementById("playlist-form");
        form.addEventListener("submit", (e) => {
            playlistInfo.currentTitle = document.getElementById('edit-title').value;
            playlistInfo.currentDesc = document.getElementById('edit-desc').value;
            
            //Check if fields are blank
            if (playlistInfo.currentTitle == "" || playlistInfo.currentDesc == ""){
                window.alert("Fields cannot be left blank.");
                e.preventDefault();
            }

            //Replace title/desc with user input if not
            /*else {
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
            }*/
        });
    }

    //---------------------------------------------------------------------ACCESSING AND CHANGING DOM ELEMENTS

    //Event listener for clicking play button
    let formPlayButtons = document.querySelectorAll(".play-btn-form");
    formPlayButtons.forEach(function(button) {
        button.addEventListener("click", (function(param) {
            return function(e) {               
                playSongForm(e, param);
            };
        }) (button));
    });

    let playButtons = document.querySelectorAll(".play-btn");
    playButtons.forEach(function(button) {
        button.addEventListener("click", (function(param) {
            return function(e) {               
                playSong(e, param);
            };
        }) (button));
    });

    //Handler for clicking play button
    let playSongForm = function(e){
        e.stopPropagation();

        let row = e.target.parentElement.parentElement.parentElement;
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

    let okButton = document.getElementById('dialog-ok');
    if (okButton){
        okButton.addEventListener("click", (function() {
            return function(e) {
                dialogOk(e);
            };
        }) ());
    }

    let dialogOk = function(e){
        console.log('clicked ok');

        let wrapper = document.getElementById('dialog-itself');
        wrapper.style.visibility="hidden";
    }

    //--------------------------------------------------------------------------------HELPER FUNCTIONS

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
});