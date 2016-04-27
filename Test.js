
describe('homepage', function(){
  it('should alert user when connected',function(done){
    
      SC.initialize({
	  client_id: '26e01e342431b86b0c8e6f8810eaf38d',
	  redirect_uri: 'http://localhost:8000/website/callback.html'
	});

	SC.connect().then(function() {
	  return SC.get('/me');
	}).then(function(me) {

	  $('#userpanel').append($('<h1 id ="greeting">Hello, ' + me.username + '</h1>'));
	  $('#likebutton').append($('<button class="btn btn-clean" type="button" onclick = "getfavorites()"></button>').html('Get Likes'));
	});
	$('#init').remove();
      
        done();
    })
  })
