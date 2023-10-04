function extend(){
    var x = document.getElementById("userLinks");
    if (x.style.display === "block"){
        x.style.display = "none";
    }
    else {
        x.style.display = "block";
    }
}

function performSearch() {
    var query = document.getElementById('search-bar').value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'path_to_server/search.php?q=' + encodeURIComponent(query), true);

    xhr.onload = function() {
        if (this.status == 200) {
            // Update the site body with search results
            document.querySelector('.sitebody').innerHTML = this.responseText;
        }
    }

    xhr.send();
}
