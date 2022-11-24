const API_KEY = 'api_key=381ab8d94e41a2bf0c14156c0a527eb2';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');

getMovies(API_URL);

function getMovies(url) {

    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        showMovies(data.results);
    })

}


function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${IMG_URL+poster_path}" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>Overview</h3>
                ${overview}
            </div>
        
        `

        main.appendChild(movieEl);
    })
}


function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

})


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

// 
//  $(function() {
//    var recommendation_account_check = false;
//    var waypoint = new Waypoint({
//      element: document.getElementById('recommendation_waypoint'),
//      handler: function(direction) {
//        if (direction == 'down' && !recommendation_account_check) {
//          recommendation_account_check = true;
//          attachLoggedInAccountTooltips(["544fe82f0e0a26134c00241d", "53d5f94f0e0a26284a006b91", "53d5f8190e0a26283e006d52", "4f7a4487760ee35b970086f0", "5616911fc3a368681701f711", "537d787ac3a3680598000870", "54a9ab849251414d5b005173", "4bc8c584017a3c122d086e4a", "56c61bc8925141245400358e", "53d54a3cc3a3686b910042f7", "53d5f75d0e0a26283b0069bf", "544fec3c0e0a2601d8002462", "4f8fd90c760ee347f8005dc5", "4e9804c05e73d65301002283", "4ff4d0aa19c2954d4f00237f", "584bd017c3a368397200969e", "4f7dd91119c29512540037b4", "4bc8ac2e017a3c122d04eeb4", "4bc896cf017a3c122d016dfd", "4bc896bb017a3c122d016b31", "4bc8abee017a3c122d04e733"], 'deebo18', '6375b9de66a7c300d552b43a', 'Add to your favorite list', 'Add to your watchlist', 'Remove from your favorite list', 'Remove from your watchlist');
//          enableLoggedInAccountTooltipActions('movie', 'deebo18', 'Add to your favorite list', 'Add to your watchlist', 'Remove from your favorite list', 'Remove from your watchlist');
//        }
//      },
//      offset: '100%'
//    });
//});


// var recommendation_waypoint_check = false;
// new Waypoint({
//  element: document.getElementById('recommendation_waypoint'),
//  handler: function(direction) {
//    if (direction == 'down' && !recommendation_waypoint_check) {
//      $.ajax({
//        url: kendo.format('/{0}/{1}/remote/recommendations', 'movie', '299536-avengers-infinity-war'),
//        type: 'GET',
//        data: {
//          version: 1,
//          translate: false
//        }
//      }).done(function(response) {
//        recommendation_waypoint_check = true;
//        $('#recommendation_waypoint').html(response).hide().fadeIn(1000);
//        initializeScroller(false, '#recommendation_scroller');
//        observer.observe();
//      });
//    }
//  },
//  offset: '100%'
// });
