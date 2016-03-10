//Cool stuff with the soundcloud api

SC.initialize({
	client_id: '26e01e342431b86b0c8e6f8810eaf38d'	
})

$(document).ready(function() {
  SC.get('/tracks', { genres: 'House' }, function(tracks) {
    $(tracks).each(function(index, track) {
      $('#results').append($('<li> + results.title + </li>').html(track.title + ' - ' + track.genre));
    });
  });
});