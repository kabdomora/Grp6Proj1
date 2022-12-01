const API_KEY = 'api_key=381ab8d94e41a2bf0c14156c0a527eb2';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

// const RAPIDAPI_APIDOJO_APIKEY = '1e054f74f0msh3a85f5fe15bc6bfp1b30e3jsn7da6ddb61b2e'
// const RAPIDAPI_APIDOJO_BASEURL = 'https://imdb8.p.rapidapi.com'
// const RAPIDAPI_APIDOJO_MOVIE_USER_REVIEWS_ENDPOINT = '/title/get-user-reviews'
// const RAPIDAPI_APIDOJO_MOVIE_USER_REVIEWS_URL = `${RAPIDAPI_APIDOJO_BASEURL}${RAPIDAPI_APIDOJO_MOVIE_USER_REVIEWS_ENDPOINT}`

// const RAPIDAPI_APIDOJO_OPTIONS = {
//     method: 'GET',
//     headers: {
//         'X-RapidAPI-Key': `${RAPIDAPI_APIDOJO_APIKEY}`,
//         'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
//     }
// };

const displaySearch = document.getElementById('displaySearch');
const form =  document.getElementById('form');
const search = document.getElementById('search');

var movie = [];
var redirectUrl = './MoviePage.html'
var stream = document.getElementById('streaming');
var reviews = document.getElementById('reviews');


getMovies(API_URL);

function getMovies(url) {

    fetch(url).then(res => res.json()).then(data => {
        // console.log(data.results)
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

    var similar = document.getElementById('similar');
    similar.innerHTML = "";

    var reviews = document.getElementById('reviews');
    reviews.innerHTML = "";

    var movieTitle = document.getElementById('movieTitle');
    movieTitle.innerHTML = "";

    var overview = document.getElementById('overview');
    overview.innerHTML = "";

    var streaming = document.getElementById('streaming');
    streaming.innerHTML = "";

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
            // console.log(data);                   

            data.collection.locations.forEach((value, index) => {
                
                if (index >= 0) {
                    var logo = value.icon;
                    var name = value.display_name;
                    var link = value.url;

                    const streamOptions = document.createElement('button');
                    streamOptions.setAttribute('id', "streamingOptions");
                    streamOptions.setAttribute('class', `
                            
                    px-5 py-3
                     bg-btn 
                     leading-tight 
                     rounded-full 
                     shadow-m hover:shadow-2xl 
                     ease-in-out duration-300
                      hover:bg-primary active:bg-dark"
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
        // console.log(data);

        var trailerHeader = document.createElement('h3');
        trailerHeader.setAttribute('class', "flex flex-row px-20 text-xl font-sans font-extrabold py-5 underline text-black-400/0 dark:text-white");
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

// function get_imdb_id() {
//     const movie_id = localStorage.getItem('movieID')
//     const movieDetailsURL = `${BASE_URL}/movie/${movie_id}?${API_KEY}`

//     // get movie's imdb_id to use with apidojo API and get user reviews
//     fetch(movieDetailsURL)
//         .then(res => res.json())
//         .then(data => {
//             localStorage.setItem('imdb_id', data.imdb_id)
//             console.log(data.imdb_id);
//         })
// }

// function movieReviews() {
//     const imdb_id = localStorage.getItem('imdb_id')
//     const reviews = document.getElementById('reviews')

//     const movie_review_url = `${RAPIDAPI_APIDOJO_MOVIE_USER_REVIEWS_URL}?tconst=${imdb_id}`
//     console.log(movie_review_url);
//     fetch(movie_review_url, RAPIDAPI_APIDOJO_OPTIONS)
//         .then(res => res.json())
//         .then(data => {

//             let total_reviews = data.reviews.length

//             let reviewHeader = document.createElement('h3');
//             reviewHeader.setAttribute('class', "flex flex-col px-10 text-xl font-sans font-extrabold py-5");
//             reviewHeader.innerHTML = `Consumer Reviews: ${total_reviews}`;
//             reviews.appendChild(reviewHeader);

//             // sort reviews by helpfulnessScore
//             data.reviews.sort((a, b) => b.helpfulnessScore - a.helpfulnessScore)

//             data.reviews.forEach((value, index) => {
//                 if (index >=0) {
//                     var userName = value.author.displayName
//                     var authorRating = value.authorRating
//                     var scoreValue = value.helpfulnessScore.toFixed(3)
//                     var reviewBody = value.reviewText

//                     const reviewCard = document.createElement('div')
//                     reviewCard.setAttribute('class', `
//                             movie-review-card
//                             pl-10
//                             container
//                             w-full
//                             rounded-lg
//                             border-4
//                             border-b-slate-400
//                         `);
//                     reviewCard.setAttribute('id', 'reviewCard')

//                     let reviewedByPEl = document.createElement('p')
//                     reviewedByPEl.setAttribute('class', 'font-bold text xl no-underline')
//                     reviewedByPEl.setAttribute('id', 'reviewed-by')
//                     reviewedByPEl.innerHTML = `Reviewed by: ${userName}`

//                     let authorRatingPEl = document.createElement('p')
//                     authorRatingPEl.setAttribute('class', 'italic text-sm underline mb-5')
//                     authorRatingPEl.setAttribute('id', 'author-rating')
//                     authorRatingPEl.innerHTML = `${authorRating}`

//                     let scoreValuePEl = document.createElement('p')
//                     scoreValuePEl.setAttribute('class', 'font-bold text-xl no-underline')
//                     scoreValuePEl.setAttribute('id', 'score-value')
//                     scoreValuePEl.innerHTML = `${scoreValue}`

//                     let contentPEl = document.createElement('p')
//                     contentPEl.setAttribute('class', 'font-medium text-base no-underline')
//                     contentPEl.setAttribute('id', 'content')
//                     contentPEl.innerHTML = `${reviewBody}`

//                     reviewCard.appendChild(reviewedByPEl)
//                     reviewCard.appendChild(authorRatingPEl)
//                     reviewCard.appendChild(scoreValuePEl)
//                     reviewCard.appendChild(contentPEl)

//                     reviews.appendChild(reviewCard)
//                 }
//             })
//         })
        // .catch(err => console.error(err))
// }

function movieReviews() {
    reviews.innerHTML = '';
    var selected = localStorage.getItem('movieID');
    let getReviews = BASE_URL.concat('/movie/', selected, '/reviews?', API_KEY, '&language=en-US&page=1');
    

    fetch(getReviews)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var totalReviews = data.total_results;

        var reviewHeader = document.createElement('button');
        reviewHeader.setAttribute('class', "accordion px-10 text-xl font-sans font-extrabold py-5 text-black-400/0 dark:text-white");
        reviewHeader.innerHTML = `⛛ Consumer Reviews: ${totalReviews}`;
        reviews.appendChild(reviewHeader);

        var reviewBody = document.createElement('div');
        reviewBody.setAttribute('class', "panel bg-inherit");
        localStorage.setItem('total-reviews', totalReviews);
        
        
        data.results.forEach((value, index) => {
            if (index >=0) {
                var userName = value.author;
                var reviewDate = value.created_at;
                var scoreValue = value.author_details.rating;
                var reviewContent = value.content;

                const reviewCard = document.createElement('div');
                reviewCard.setAttribute('id', 'card');
                reviewCard.setAttribute('class', "pl-10 container w-full rounded-lg border-4 border-b-slate-400");
                

                reviewCard.innerHTML = `
                <p id="reviewed-by" class="font-bold text-xl">
                    Reviewed by: ${userName}</p>
                <p id="created-at" class="italic text-sm underline mb-5">
                    ${reviewDate}</p>
                <p id="rating" class="font-bold text-xl">
                    ${scoreValue}</p>
                <p id="content" class="font-medium text-base">
                    ${reviewContent}</p>
                `;

                reviewBody.appendChild(reviewCard);                
            }
        })

        reviews.appendChild(reviewBody);
        
    })
}

// tester code accordion

// var acc = document.getElementsByClassName("accordion");
// var i;

// for (i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function() {
//     this.classList.toggle("active");
//     var panel = this.nextElementSibling;
//     if (panel.style.maxHeight) {
//       panel.style.maxHeight = null;
//     } else {
//       panel.style.maxHeight = panel.scrollHeight + "px";
//     }
//   });
// }

// tester code accordion

reviews.addEventListener('click', function(event) {
    var element = event.target;
    var totalReviews = localStorage.getItem('total-reviews');

    if (element.matches('button') === true) {
        var button = this.firstChild;
        button.classList.toggle("active");
        button.innerHTML = `Consumer Reviews: ${totalReviews}`;
        var panel = button.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
          button.innerHTML = `⛛ Consumer Reviews: ${totalReviews}`;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
    }
})




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
        // console.log(data);

        var recommendedHeader = document.createElement('h3');
        recommendedHeader.setAttribute('class', "flex flex-row px-20 text-xl font-sans font-extrabold py-5 underline text-black-400/0 dark:text-white");
        recommendedHeader.innerHTML = 'Similar Recommendations';
        similar.appendChild(recommendedHeader);

        data.results.forEach(movie => {
            const {title, poster_path, vote_average, overview, id} = movie;

            ovID = overview.replace(/\s+/g, '*');
            movieID = title.replace(/\s+/g, '*');

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
               <h3 id=${id}+${poster_path}+${vote_average}+${ovID}+${movieID}>Overview: 
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
        // console.log(index);
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
        similarRecommendations();
        // get_imdb_id();
        movieReviews();
        
    }
});

similar.addEventListener('click', function(event) {
    var element = event.target;

    if (element.matches('button') === true) {
        var index = element.parentElement.getAttribute('id');
        movie.splice(index, 1);
        // console.log(index);
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
        similarRecommendations();
        // get_imdb_id();
        movieReviews();
        
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







