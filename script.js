var movieName = document.querySelector('#movie-name');
var searchButton = document.querySelector('#fetch-button');
var deleteMe = document.querySelector('#deletelater');
var msgDiv = document.querySelector("#msg");

window.onload = localStorage.clear();

renderLastRegistered();

function displayMessage(type, message) {
    msgDiv.textContent = message;
    msgDiv.setAttribute("class", type);
}

function renderLastRegistered() {
    var movieEl = localStorage.getItem('movie');
    deleteMe.textContent = movieEl;

}

searchButton.addEventListener('click', function(event) {
    event.preventDefault();

    var movie = document.querySelector('#movie-name').value;

    if (movie === "") {
        displayMessage("error", "Please enter a movie title to search the database");
    } else {
        displayMessage("success", "");
        localStorage.setItem("movie", movie);
        renderLastRegistered();
    }
});


// request API for the videos associated with a movie: https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=<<api_key>>&language=en-US 
// The trailer you can watch this way:

// Trailer URL

// When you make an API Request requesting Videos,
// in the response you will receive something like this:

// videos  
// results 
// 0   
// iso_639_1   "en"
// iso_3166_1  "US"
// name    "Fight Club - Theatrical Trailer Remastered in HD"
// key "6JnN1DmbqoU"
// site    "YouTube"
// size    1080
// type    "Trailer"
// official    false
// published_at    "2015-02-26T03:19:25.000Z"
// id  "5e382d1b4ca676001453826d"
// Just add the Key in the respective URL:

// YouTube: https://www.youtube.com/watch?v=  
// Vimeo: https://vimeo.com/  
// For example:
// Youtube: https://www.youtube.com/watch?v=6JnN1DmbqoU
// Youtube: https://www.youtube.com/watch?v=hzfvYSIIgyc
// Vimeo: https://vimeo.com/282875052