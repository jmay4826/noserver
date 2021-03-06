angular.module("movieApp").service("searchService", function($http) {
  var that = this;
  var apiUrl = "https://api.themoviedb.org/3/";
  var apiKey = "?api_key=1c18362aec433105dd7c8fc4efb15a14";
  // this.imageBaseUrl = "http://image.tmdb.org/t/p/"; //each view queries this as a resolve, here for reference
  // this.imageSize = "w780"; //each view queries this as a resolve, here for reference

  this.genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    53: "Thriller"
  };

  this.apiConfiguration = function() {
    return $http
      .get(apiUrl + "configuration" + apiKey)
      .then(function(response) {
        that.imageBaseUrl = response.data.images.base_url;

        that.imageSize = response.data.images.backdrop_sizes[1];
      });
  };
  this.findMoviesBy = function(selector) {
    return $http.get(apiUrl + "movie/" + selector + apiKey);
  };
  this.findMovieDetails = function(id) {
    return $http.get(
      apiUrl + "movie/" + id + apiKey + "&append_to_response=reviews,videos"
    );
  };
  this.getSimilar = function(id) {
    return $http.get(apiUrl + "movie/" + id + "/recommendations" + apiKey);
  };

  this.discover = function(options, extra) {
    return $http
      .get(
        apiUrl +
          "discover/movie" +
          apiKey +
          options +
          "&primary_release_date.lte=2017-08-01"
      )
      .then(function(response) {
        if (extra) {
          response.data.results = response.data.results.map(function(movie) {
            $http
              .get(apiUrl + "movie/" + movie.id + "/credits" + apiKey)
              .then(function(detailResponse) {
                movie.cast = [];
                for (var i = 0; i < 10; i++) {
                  if (detailResponse.data.cast[i]) {
                    movie.cast.push(detailResponse.data.cast[i].name);
                  }
                }

                return detailResponse;
              });
            return movie;
          });
        }
        return response;
      });
  };
});
