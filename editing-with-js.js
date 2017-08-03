var request = require("request"),
	cookie = request.cookie('MC_STORE_ID=66860');

request('https://test.wikipedia.org/w/api.php?action=query&format=json&meta=tokens&type=login', function (error, response, body) {
  	var token = JSON.parse(body).query.tokens.logintoken;
  	cookie = response.headers['set-cookie'];

  	if(token && cookie) {
  		loginToWiki(token, cookie);
  	}
});

var loginToWiki = function(token, cukie) {
	var options = {
	    url: 'https://test.wikipedia.org/w/api.php',
	    method: 'POST',
	    headers: {
	  		'content-type' : 'application/x-www-form-urlencoded',
	  		'Cookie': cukie
	  	},
	    form: {
		  	'lgname': '...', 
		  	'lgpassword': "...", //https://www.mediawiki.org/wiki/Manual:Bot_passwords
		  	'lgtoken': token,
		  	'action' : 'login',
		  	'format' : 'json'
		}
	}

  	request(options, function(error, response, body){
		cookie = response.headers['set-cookie'];
  		getEditToken(cookie);
	});	
}

var getEditToken = function(cukie) {
	var options = {
	    url: 'https://test.wikipedia.org/w/api.php?format=json&action=query&meta=tokens',
	    method: 'GET',
	    headers: {
	  		'Cookie': cukie
	  	}
	}

	request(options, 
		function (error, response, body) {
		  	var token = JSON.parse(body).query.tokens.csrftoken;
		  	cookie = response.headers['set-cookie'];		  	
		  	
		  	if(token && cookie) {
		  		makeAnEdit(token, cookie);
		  	}
	});
}

var makeAnEdit = function(token, cukie) {
	var options = {
	    url: 'https://test.wikipedia.org/w/api.php',
	    method: 'POST',
	    headers: {
	  		'Cookie': cukie
	  	},
	  	form: {
	  		'action' : 'edit',
		  	'format' : 'json',
		  	'title': "Wikipedia:Sandbox",
		  	'text': "Node edit",
		  	'summary': "Node edit",
		  	'token': token,
		}
	}

	request(options, 
		function (error, response, body) {
			if(error) {
				console.log(error);
			} else {
				console.log( "************************************************************************ \n Navigate to https://test.wikipedia.org/w/index.php?title=Wikipedia:Sandbox&action=history and check if your code just accidentally made an edit to the test version of Wikipedia.\n\nIf it didn't, then there is a problem with this code, and you will probably need to spend time fixing the broken cookie handling :)\n************************************************************************");
			}
	});
}