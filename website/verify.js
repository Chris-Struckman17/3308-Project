$(document).ready(function(){
	$('#auth').on('click', auth);
});

function auth(){
	SC.initialize({
	  client_id: '26e01e342431b86b0c8e6f8810eaf38d',
	  redirect_uri: 'http://example.com/callback'
	});

	// initiate auth popup
	SC.connect().then(function() {
	  return SC.get('/me');
	}).then(function(me) {
	  alert('Hello, ' + me.username);
	});
}