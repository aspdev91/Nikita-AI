
function retrieveAddress(cmd){
	if(cmd.includes("to")){
		//Substring city after in
		reqDest = cmd.split("to ")[1]
	} else {
		reqDest = cmd
	}
	SendRequestAddress(reqDest)
}

function SendRequestAddress( reqDest ){ 
    var httpRequest = new XMLHttpRequest();
    let api_key = ''
    let url = 'https://maps.googleapis.com/maps/api/place/textsearch/xml?query=' + reqDest.split(" ").join("+") + '&key=' + api_key
    httpRequest.onreadystatechange = function() { HandleReplyAddress(httpRequest, reqDest); };  
    httpRequest.open("GET", url, true); 
    httpRequest.setRequestHeader('jsonpCallback', 'jsonCallback')
    httpRequest.send(null);  
    
    app.ShowProgress( "Loading..." ); 
} 

function HandleReplyAddress( httpRequest,reqDest ) 
{  
    if( httpRequest.readyState==4 ) {
        if( httpRequest.status==200 ) { 
            console.log( "Response: " + httpRequest.status + httpRequest.responseText); 
            AddressAction(httpRequest.places, reqDest);
        } 
        else{
           console.log( "Error: " + httpRequest.status + httpRequest.responseText); 
           app.TextToSpeech( "There was an error retrieving the location of your desired destination. Try another place.", 1, 1);
    	}
    } 
  app.HideProgress(); 
} 

function AddressAction( destination, reqDest, count ){
	console.log(JSON.parse(destination))
	count = count || 0;
	let destName = destination["results"][count]["name"]
	destAddress = destination["results"][count]["formatted_address"]
	let open = destination["results"][count]["open_now"]
	let destComm = `I found ${destName} at ${destAddress}. Is this what your looking for?`
	if(open){
		speech.SetOnResult(speech_OnResultAddress)
		app.TextToSpeech(destComm, 1, 1, Listen)
	} else{
		speech.SetOnResult(speech_OnResultClosed)
		app.TextToSpeech('This place is currently closed. Would you like me to the next search result or go elsewhere?', 1, 1, Listen)
	}
}

function speech_OnResultAddress(results, partial){
	speech.SetOnResult( speech_OnResult )
	if( !partial ){
		let cmd = results[0].toLowerCase();
		console.log( cmd );
		if( cmd.includes("yes") || cmd.includes("that's it") || cmd.includes("that's the one")){
			speech.SetOnResult(speech_OnResultTransporation)
			app.TextToSpeech("Would you like me to call an Uber or get train directions?", 1, 1, Listen)
		} else if(cmd.includes("no") || cmd.includes("another") || cmd.includes("not")){
			app.TextToSpeec
		}
	}
}

function speech_OnResultTransporation(results, partial){
	speech.SetOnResult( speech_OnResult )
	if( !partial ){
		let cmd = results[0].toLowerCase();
		console.log( cmd );
		if( cmd.includes("Uber") || cmd.includes("car") || cmd.includes("taxi") || cmd.includes("yes") || cmd.includes("yeah")){
			getUber('book car', 'current',destAddress)
		} else if(  cmd.includes("train") || cmd.includes("MTA") || cmd.includes("subway")) {
			// ADD train handler 
		} else {	
			app.TextToSpeech("Alright, let me know if you need anything else", 1, 1)
		}
	}
}