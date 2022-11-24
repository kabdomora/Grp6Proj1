const API_KEY = 'api_key=381ab8d94e41a2bf0c14156c0a527eb2';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/recommendations?'
const IMG_URl = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
getMovies(API_URL);

function getMovies(url) {

    fetch(url).then(res => res.json).then(data => {
        console.log(data.results)
        showMovies(data.results);

    })
}

function showMovies(data) {
    data.forEach(movie => {
        const (title, poster_path) = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = 



        main.appendChild(movieEl);
    }
        
        
        )
}

form.addEventListener('submit', (e) => 
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

})