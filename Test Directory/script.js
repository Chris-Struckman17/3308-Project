//Cool stuff with the soundcloud api
$(document).ready(function(){
	$('#stream').on('click', streambutton);
});

function streambutton(){	
	
	SC.initialize({
      client_id: '26e01e342431b86b0c8e6f8810eaf38d'
    });

    /*function playsound(genre) {
    	SC.get('/tracks', {
    		genres: genre,
    		bpm: {
    			from: 124
    		}
    	}, function(tracks) {
    		var number = 46;
    		SC.oEmbed(tracks[random].uri, {auto_play: true}, document.getElementById('target'));
    	});
    }

	*/
	
	var input = 
    SC.get('/playlists/2050462').then(function(playlist) {
    	playlist.tracks.forEach(function(track){
    		$('#tracks').append(track.title, '<br>'); 
    	});
    	playlist.tracks.forEach(function(track){
    		console.log(track.id)
    	});
    

});
}

      



