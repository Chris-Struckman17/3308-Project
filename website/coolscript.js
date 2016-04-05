  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>


$(document).ready(function(){
	$('#newsounds').on('click', newsounds);
});

function newsounds(){
	SC.initialize({
		client_id: '26e01e342431b86b0c8e6f8810eaf38d'
	});
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




function playsound(genre) {
	SC.get('/tracks', {
    		genres: genre,
    		bpm: {
    			from: 124
    		}
    	}, function(tracks) {
    		var number = 46;
    		SC.oEmbed(tracks[number].uri, {auto_play: true}, document.getElementById('target'));
    	});
 }

window.onload = function() {
	SC.initialize({
		client_id: '26e01e342431b86b0c8e6f8810eaf38d'
	});

	var menuLinks = document.getElementsByClassName('genre');
	for (var i = 0; i < menuLinks.length; i++) {
		var menuLink = menuLinks[i];
		menuLinks[i].onclick = function(e) {
			e.preventDefault();
			playsound(menuLink.innerHTML);
		};
	}
};
