function retrieveNews(cmd){
	newsCommands = ["the news at","get the news at","what's happening on","tell me the news at","what's going on at "]
	for(var newsCommand of newsCommands){
		if(cmd.includes(newsCommand)){
			newsSource = cmd.replace(newsCommand + " ","");
			newsSource = newsSource.split(" ").join("-")
			break;
		}
	}

	SendRequestNews(newsSource)
}	 
	

function SendRequestNews( newsSource ){ 
    var httpRequest = new XMLHttpRequest();
    api_key = '6d48d165929d4b568c837d2869079c68'
    let url = 'https://newsapi.org/v1/articles?source=' + newsSource + '&apiKey='+ api_key
    httpRequest.onreadystatechange = function() { HandleReplyNews(httpRequest, newsSource); };  
    httpRequest.open("GET", url, true); 
    httpRequest.send(null);  
    
    app.ShowProgress( "Loading..." ); 
} 

function HandleReplyNews( httpRequest, newsSource ) 
{  
    if( httpRequest.readyState==4 ) {
        if( httpRequest.status==200 ) { 
            console.log( "Response: " + httpRequest.status + httpRequest.responseText); 
            ReadNews(JSON.parse(httpRequest.responseText), newsSource);
        } 
        else{
       	   speech.SetOnResult( speech_OnResultNewsSource )
           console.log( "Error: " + httpRequest.status + httpRequest.responseText); 
           app.TextToSpeech( "Couldn't recognize that source. Tell me the news source again.", 1, 1, Listen);
    	}
    } 
  app.HideProgress(); 
} 

function ReadNews(newsResult, newsSource){
    allArticles = 'This is whats happening on ' + newsSource + ' . . . .';
    count = 0
	for(var article of newsResult.articles){
	    if(count >= 3){
	        break
	    }
		allArticles += article.title;
		allArticles += '.   .   .   .   .'
		allArticles += article.description;
		allArticles += ' next up . . .'
		count += 1
	}
	
	app.TextToSpeech( allArticles, 1, 1);
}

function speech_OnResultNewsSource(results, partial){
	
	if( !partial ){
	    speech.SetOnResult( speech_OnResult )
		let cmd = results[0].toLowerCase();
		console.log( cmd );
		cmd = cmd.split(" ").join("-")
		SendRequestNews(cmd);
	} 
}