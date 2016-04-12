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


function getuser_id(){
	var url = "https://soundcloud.com/jinjirow"
	SC.get('/resolve', {
	}, function(user) {
		console.log(user.id);
	});

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
	  alert('Hello, ' + me.username);
	});
}

function addElement () {
	var newDiv = document.createElement("div");
	var newContent = document.createTextNode("U Are");
	newDiv.appendChild(newContent);

	var currentDiv = document.getElementById("div1");
	document.body.insertBefore(newDiv, currentDiv);
}

