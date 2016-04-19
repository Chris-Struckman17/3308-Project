/*$(document).ready(function () {
	var widget
    widget.bind(SC.Widget.Events.READY, function() {
	  console.log('Ready...');
	});
	$('button').click(function() {
	  widget.toggle();
	};
});)
*/


/*function nextsong(){
	  var id;
	  console.log(id);
	  var widgetIframe = document.getElementById('sc-widget'),
	      widget       = SC.Widget(widgetIframe),
	      newSoundUrl = 'http://api.soundcloud.com/tracks/' + id;

	  widget.bind(SC.Widget.Events.READY, function() {
	    // load new widget
	    widget.bind(SC.Widget.Events.FINISH, function() {
	      widget.load(newSoundUrl, {
	        show_artwork: false
	    });
	  });
	});
}
*/
var songarray = [];
var i = 0;
var songname;

 
function search(){
    SC.initialize({
	    client_id: '26e01e342431b86b0c8e6f8810eaf38d'
    });
    var genrename = document.getElementById('genre').value
    SC.get('/tracks', { 
	  genres: genrename, bpm: { from: 130 }
    }).then(function(tracks) { 
  	  console.log(tracks);
  	  $.each( tracks, function( index, track) { //loops through track objects and appends each result to a button 
  	    console.log(i);
  	    var songid = track.id;
  	    songarray[i++] = songid;
  	    console.log(songarray[0]);
  	    $('#results').append($('<button class="btn btn-clean" type="button" onclick = "songbutton()">Play </button>').html(track.title));
  	    $('#results').append('<br>');
  	  });
    });
  

}

function songbutton(){
	$('#playerctrl').append($('<iframe width="100%" height="250" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + songarray[0] + '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>'));
}


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
	  $('#userpanel').append($('<h1>Hello, ' + me.username + '</h1>'));
	  $('#userpanel').append($('<div class="container"><div class="row"><div class="panel panel-default"><div class="panel-heading">Your Account</div><iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/171892596&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe></div></div></div>'));
	});
}



