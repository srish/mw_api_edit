/* Declare both node and javascript variables */
var express = require('express'),
	app = express(),
	XHR = require("xmlhttprequest").XMLHttpRequest,
	username = '...',
    password = '...',
    summary = 'JS script says hi',
    message = 'Bot work in progress',
    page = 'Wikipedia:Sandbox',
    api_url = "https://test.wikipedia.org/w/api.php";

/* Get login token */
var params_1 = "?action=query&format=json&meta=tokens&type=login";
var new_url = api_url + params_1;
xhr = new XHR();
xhr.onreadystatechange = extractLoginToken;
xhr.open( "GET", new_url, true ); 
xhr.send();

function extractLoginToken() {
	if ( this.readyState !== 4 || this.status !== 200 ) {
        return;
    }
    var res = JSON.parse(this.responseText);
    var query = res && res.query;
    var tokens = query && query.tokens;
    var logintoken = tokens && tokens.logintoken;
    if( logintoken ) {
        logMeIn( logintoken );
    }
}

/* Use the token obtained in extractLoginToken() & wiki credentials
to login */ 
function logMeIn(token) {
    if( token ) {
        var params_2 = 'action=login&format=json&lgname=' + username + '&lgpassword=' + password + '&lgtoken=' + token;

        xhr = new XHR();
        if(!xhr) {
        	return;
        }

        xhr.open( 'POST', api_url, true );
        xhr.onreadystatechange = getEditToken;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send( params_2 ); 
    }
}

/* Get an additional token to make edits */
function getEditToken() {
    if ( this.readyState !== 4 || this.status !== 200 ) {
        return;
    }
    
    var params_3 = '?format=json&action=query&meta=tokens';
    var new_url_1 = api_url + params_3;

    xhr = new XHR();
    if(!xhr) {
    	return;
    }

    xhr.open( "GET", new_url_1, true ); 
    xhr.onreadystatechange = makeAnEdit;
    xhr.send();        
}

/* Make an edit using the token obtained in getEditToken() */
function makeAnEdit() {
    if ( this.readyState !== 4 || this.status !== 200 ) {
        return;
    }

    var res = JSON.parse(this.responseText);
    var query = res && res.query;
    var tokens = query && query.tokens;
    var csrfToken = tokens && tokens.csrftoken;

    var params_4 = 'format=json&action=edit&assert=user&appendtext=' + message + '&summary=' + summary + '&title=' + page + '&token=' + csrfToken;

    xhr = new XHR();
    if(!xhr) {
    	return;
    }

    xhr.open( 'POST', api_url, true );
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send( params_4 ); 
}

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port   
   console.log( "************************************************************************ \n Navigate to https://test.wikipedia.org/w/index.php?title=Wikipedia:Sandbox&action=history and check if your code just accidentally made an edit to the test version of Wikipedia.\n\nIf it didn't, then there is a problem with this code, and you will probably need to spend time fixing the broken cookie handling :)\n************************************************************************");
})