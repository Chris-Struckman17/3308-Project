var app = angular.module('sounds');

app.service('soundService', function($http) {

  this.getArtist = function(artist) {
    return $http({
      method: 'GET',
      url: 'http://api.soundcloud.com/users/' + artist + '/tracks.json?client_id=26e01e342431b86b0c8e6f8810eaf38d'
    })
  };

})