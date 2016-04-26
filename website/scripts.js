
function getUserData(){
SC.initialize({
	  client_id: '26e01e342431b86b0c8e6f8810eaf38d',
	  redirect_uri: 'http://localhost:8000/website/callback.html'
	});
	SC.connect().then(function() {
	  return SC.get('/me');
	}).then(function(me) {
	  $('#userpanel').append($('<h1>Hello '+ me.first_name+'!</h1>'));
	  $('#userpanel').append($('<h1>You have '+ me.followers_count+' followers!</h1>'));
	  if(me.followers_count < 5){
	  	$('#userpanel').append($('<h5>You must have horrible Taste in music! Check out our Website for help!</h5>'));
	  }else if(5 < me.followers_count <100){
	  	$('#userpanel').append($('<h5>You have decent taste to have that many followers!</h5>'));
	  }
	  else{
	  		$('#userpanel').append($('<h5>Why are you here, you are a musical god!</h5>'));
	  	}
	  
	  if(me.following_count>0){
	  $('#userpanel').append($('<h1>You are currently following '+ me.following_count+' person(s)!</h1>'));
	}else{$('#userpanel').append($('<h1>You are currently following no one!</h1>'));
$('#userpanel').append($('<h5>Go follow someone to get more music!</h5>'));
}
	  $('#userpanel').append($('<h1>You are from '+ me.country+'!</h1>'));
	  if(me.country!="United States"){
	  	$('#userpanel').append($('<h5>Hello From the United States!</h5>'));
	  }
	  $('#userpanel').append($('<h1>You currently have '+ me.track_count+' tracks at your disposal!</h1>'));
	  $('#userpanel').append($('<h1>You currently have '+ me.playlist_count+' playlists attached to your account!</h1>'));


	});
	

}



var songarray = [];
var i = 0;
var songname;
var queueid;




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
  	    var songid = track.title;
  	    songarray[i++] = songid;
  	    console.log(songarray[0]);
  		$('#results').append($('<img class ="img" src="' +track.artwork_url+ '"></img>').html(''));
  	    $('#results').append($('<button class="btn btn-clean" type="button" onclick = "songbutton(\'' + track.id + '\')"></button>').html(track.title));
  	    $('#results').append($('<button class="btn btn-clean" type="button" onclick = "queuebutton(\'' + track.id + '\',\'' + track.title + '\')"></button>').html('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'));
  	    $('#results').append('<br>');
  	  });
    });
  

}

function queuebutton(nextsong, tracktitle){
	queueid = nextsong;
	$('#queue').html('<div class ="alert alert-info" role="alert">Up Next: '+tracktitle+'<div>');
	console.log(tracktitle);
	var newSoundUrl = "http://api.soundcloud.com/tracks/"+queueid;
	var iframe = document.querySelector('#sc-widget');
	var widget = SC.Widget(iframe);
	widget.bind(SC.Widget.Events.FINISH, function() {
		widget.load(newSoundUrl);
		widget.bind(SC.Widget.Events.READY, function() {
			widget.play();
		})
	});
}




function songbutton(trackid){
	$('#playerctrl').html($('<iframe id ="sc-widget" width="100%" height="250" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + trackid + '&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>'));
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

function getfavorites(){
	$('#likebutton').remove();
	$('#greeting').remove();
	SC.get('/me/favorites').then(function(tracks){
		console.log(tracks);
		$.each( tracks, function( index, track) {
			$('#likes').append($('<img class ="img" src="' +track.artwork_url+ '"></img>').html(''));
			$('#likes').append($('<button class="btn btn-clean" type="button" onclick = "songbutton(\'' + track.id + '\')"></button>').html(track.title));
			$('#likes').append($('<button class="btn btn-clean" type="button" onclick = "queuebutton(\'' + track.id + '\',\'' + track.title + '\')"></button>').html('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'));
	 	    $('#likes').append('<br>');
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

	  $('#userpanel').append($('<h1 id ="greeting">Hello, ' + me.username + '</h1>'));
	  $('#likebutton').append($('<button class="btn btn-clean" type="button" onclick = "getfavorites()"></button>').html('Get Likes'));
	});
	$('#init').remove();
}
 


