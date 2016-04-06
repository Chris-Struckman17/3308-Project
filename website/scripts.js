



function showsounds(){
		  	SC.get('/playlists/2050462').then(function(playlist) {
		    	playlist.tracks.forEach(function(track){
		    		$('#tracks').append(track.title, '<br>'); 
		    	});
		    	playlist.tracks.forEach(function(track){
		    		var x = track.id;
		    		console.log(x);
		    	});
			});
}


function auth(){
	SC.initialize({
	  client_id: '26e01e342431b86b0c8e6f8810eaf38d',
	  redirect_uri: 'http://localhost:8000/website/callback.html'
	});

	// initiate auth popup
	SC.connect().then(function() {
	  return SC.get('/me');
	}).then(function(me) {
	  alert('Hello, ' + me.username);
	});

}

