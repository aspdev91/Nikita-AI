app.LoadScript( "nikita.js" );

function retrieveQuote(cmd){
	console.log(cmd)
	var url;

	if(cmd=="inspire me"){ url="http://quotes.rest/qod.json?category=inspire"}
	else if(cmd=="englighten me"){url="http://quotes.rest/qod.json?category=life"}
			else if(cmd=="quote of the day"){url="http://quotes.rest/qod.json"}
				else if(cmd=="quote of the day"){url="http://quotes.rest/qod.json"}
	console.log(url)
	
	SendRequestQuotes(url);
}

function SendRequestQuotes( url ) 
{ 
    var httpRequest = new XMLHttpRequest(); 
    httpRequest.onreadystatechange = function() { HandleReplyQuotes(httpRequest); };  
    httpRequest.open("GET", url, true); 
    httpRequest.setRequestHeader("Content-Type",
        "application/json"); 
    httpRequest.send(null); 
} 

function HandleReplyQuotes( httpRequest ) 
{ 
    if( httpRequest.readyState==4 ) 
    { 
        if( httpRequest.status==200 ) 
        { 
            console.log( "Response: " + httpRequest.status + httpRequest.responseText); 
            result = JSON.parse(httpRequest.responseText);
            app.TextToSpeech( result['contents']['quotes'][0]['quote'] + ' . . by . . .' + result['contents']['quotes'][0]['author'], 1, 1 )
}
        } 
        //An error occurred 
        else{
           console.log( "Error: " + httpRequest.status + httpRequest.responseText); 
    	   app.TextToSpeech( 'Try Again' , 1, 1 )
    }
} 