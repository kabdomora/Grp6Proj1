const API_KEY = 'api_key=381ab8d94e41a2bf0c14156c0a527eb2';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const displaySearch = document.getElementById('displaySearch');
const form =  document.getElementById('form');
const search = document.getElementById('search');

var movie = [];
var redirectUrl = './MoviePage.html'
var stream = document.getElementById('streaming');

getMovies(API_URL);

function getMovies(url) {

    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        showMovies(data.results);
    })

}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    
    var trailer = document.getElementById('trailer');
    trailer.innerHTML = '';

    var poster = document.getElementById('poster');
    poster.innerHTML = "";

    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

    search.value = '';

})


function moviePoster() {
    var posterPath = localStorage.getItem('posterPath');
    var poster = document.getElementById('poster');

    var overview = localStorage.getItem('overview');
    if(overview) {
        overview = overview.replaceAll('*', ' ');
        localStorage.setItem('overview', overview);
    }


    var movieTitle = localStorage.getItem('movieTitle');
    if(movieTitle) {
        movieTitle = movieTitle.replaceAll('*', ' ');
        localStorage.setItem('movieTitle', movieTitle);
    }

    poster.innerHTML = "";

    var vote = localStorage.getItem('movieRating');
    var title = localStorage.getItem('movieTitle');

    poster.innerHTML = `
    <img src="${IMG_URL+posterPath}" alt="Movie Poster">
   <div class="movie-info">
       <h3>${title}</h3>
       <span class="${getColor(vote)}">${vote}</span>
   </div>

`;



/* <div class="overview"> */
//        <h3 id=${id}+${poster_path}+${vote_average}+${ovID}+${movieID}>Overview: 
//        <button id="movie-button">Go To Movie 👉
//        <span id='movieID' class='text-xs invisible'>${id}</span>
//        </button>
//        </h3>
//        ${overview}
//    </div>


    // var imgPoster = document.createElement('img');
    // imgPoster.setAttribute('src', IMG_URL.concat(posterPath));
    // imgPoster.setAttribute('alt', "Movie poster");

    // poster.appendChild(imgPoster);

}


function streamHere() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3e05fc6e07msha3ef85533b3b988p12197cjsna8507f3b33d3',
            'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
        }
    };
    
    var selected = localStorage.getItem('movieID');
    let pullServices = 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup?source_id=movie%2F'.concat(selected, '&source=tmdb&country=us');
    

    stream.innerHTML = "";
    
    fetch(pullServices, options)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);                   

            data.collection.locations.forEach((value, index) => {
                
                if (index >= 0) {
                    var logo = value.icon;
                    var name = value.display_name;
                    var link = value.url;

                    const streamOptions = document.createElement('button');
                    streamOptions.setAttribute('id', "streamingOptions");
                    streamOptions.setAttribute('class', `
                            bg-cyan-800 
                            hover:bg-cyan-600 
                            focus:outline-none 
                            focus:ring focus:ring-cyan-300 
                            active:bg-cyan-700 
                            px-10 py-2 text-sm 
                            leading-5 rounded-full 
                            font-semibold text-white
                    `);

                    
                    streamOptions.innerHTML = `
                    <a href="${link}">
                    <img src="${logo}" alt="${name}">
                    </a>         
               `;


                stream.appendChild(streamOptions); 
                }
            })

            
        })
        .catch(err => console.error(err));

}


function movieDetails() {
    var Title = localStorage.getItem('movieTitle');
    var OverV = localStorage.getItem('overview');
    var TitleDiv = document.getElementById('movieTitle');
    var OverDiv = document.getElementById('overview');

    TitleDiv.innerHTML = Title;
    OverDiv.innerHTML = OverV;
}

function movieTrailer() {
    displaySearch.innerHTML = '';
    var selected = localStorage.getItem('movieID');
    let pullMovie = BASE_URL.concat('/movie/', selected, '/videos?', API_KEY, '&language=en-US');
    var trailer = document.getElementById('trailer');
    
    fetch(pullMovie)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // let { key } = data.results[0];
        trailer.innerHTML = '';
        console.log(data);

        var trailerHeader = document.createElement('h3');
        trailerHeader.setAttribute('class', "flex flex-row px-20 text-xl font-sans font-extrabold py-5 underline");
        trailerHeader.innerHTML = 'Trailers and Other Videos';

        data.results.forEach((value, index) => {
            if (index >= 0) {
                var key = value.key
                let callVideo = 'https://www.youtube.com/embed/'.concat(key);
                
                const videoEl = document.createElement('iframe');
                videoEl.setAttribute('class', "flex flex-row shrink-0 w-80 h-40 rounded-lg shadow-xl bg-white mx-5");                
                videoEl.setAttribute('src', callVideo);

               

                trailerHeader.appendChild(videoEl);
                trailer.appendChild(trailerHeader);
            } 
   
        })   
        
    })


    trailer.setAttribute('class', 'flex flex-row relative rounded-xl overflow-auto');
}


function similarRecommendations() {
    var selected = localStorage.getItem('movieID');
    let pullSimilarTitles = BASE_URL.concat('/movie/', selected, '/similar?', API_KEY, '&language=en-US');
    var similar = document.getElementById('similar');

    fetch(pullSimilarTitles)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        similar.innerHTML = '';
        console.log(data);

        var recommendedHeader = document.createElement('h3');
        recommendedHeader.setAttribute('class', "flex flex-row px-20 text-xl font-sans font-extrabold py-5 underline");
        recommendedHeader.innerHTML = 'Similar Recommendations';
        similar.appendChild(recommendedHeader);

        data.results.forEach(movie => {
            const {title, poster_path, vote_average, overview, id} = movie;
            const similarEl = document.createElement('div');
            similarEl.classList.add('movieSimilar');
            similarEl.setAttribute('id', id);
            similarEl.innerHTML = `
            <img src="${IMG_URL+poster_path}" alt="${title}">
            <div class="movie-info">
               <h3>${title}</h3>
               <span class="${getColor(vote_average)}">${vote_average}</span>
             </div>
             <div class="overview">
               <h3 id=${id}-${poster_path}>Overview: 
               <button id="movie-button">Go To Movie 👉
               <span id='movieID' class='text-xs invisible'>${id}</span>
               </button>
               </h3>
               ${overview}
           </div>
       
       `;
        similar.appendChild(similarEl);


        })
    });
    similar.setAttribute('class', 'flex flex-row relative rounded-xl overflow-auto');
}


function showMovies(data) {
    displaySearch.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;

        ovID = overview.replace(/\s+/g, '*');
        movieID = title.replace(/\s+/g, '*');

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.setAttribute('id', id);
        movieEl.innerHTML = `
             <img src="${IMG_URL+poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3 id=${id}+${poster_path}+${vote_average}+${ovID}+${movieID}>Overview: 
                <button id="movie-button">Go To Movie 👉
                <span id='movieID' class='text-xs invisible'>${id}</span>
                </button>
                </h3>
                ${overview}
            </div>
        
        `;

        displaySearch.appendChild(movieEl);
        
    })



}

var movieTile = document.querySelector('#displaySearch');
    
movieTile.addEventListener('click', function(event) {
    var element = event.target;

    if (element.matches('button') === true) {
        var index = element.parentElement.getAttribute('id');
        movie.splice(index, 1);
        console.log(index);
        var splitIDs = index.split("+");
        localStorage.setItem('movieID', splitIDs[0]);  
        localStorage.setItem('posterPath', splitIDs[1]);
        localStorage.setItem('movieRating', splitIDs[2]);
        localStorage.setItem('overview', splitIDs[3]);
        localStorage.setItem('movieTitle', splitIDs[4]);

        moviePoster();
        movieTrailer();
        streamHere();
        movieDetails();
        
    }
});


function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}




