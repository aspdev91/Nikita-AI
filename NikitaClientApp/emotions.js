app.LoadScript('Nikita.js');
app.LoadScript('Songs.js');

function emotionAnalysis(){
	speech.SetOnResult( speech_OnResultExpress )
	app.TextToSpeech( 'Tell me what happened.' , 1, 1, Listen )				
}


function SendRequestEmotions(recording){ 
    var httpRequest = new XMLHttpRequest();
    let url = 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text='
    url += recording.split(' ').join('%20')
    console.log(url)
    httpRequest.onreadystatechange = function() { HandleReplyEmotions(httpRequest); };  
    httpRequest.open("GET", url, true); 
    httpRequest.setRequestHeader('Authorization','Basic API_KEY')
    httpRequest.send(null); 
    
    app.ShowProgress( "Loading..." ); 
} 

function HandleReplyEmotions( httpRequest ) 
{  
    if( httpRequest.readyState==4 ) {
        if( httpRequest.status==200 ) { 
            console.log( "Response: " + httpRequest.status + httpRequest.responseText); 
            EmotionEngine(httpRequest.responseText);
        } 
        else{
           console.log( "Error: " + httpRequest.status + httpRequest.responseText); 
           app.TextToSpeech("Seems like there's an error reading your emotion. See my debug log",1,1)
        }
    } 
  app.HideProgress(); 
} 


function EmotionEngine(watsonResults){
    watsonResults = JSON.parse(watsonResults)
	emotionTones = watsonResults['document_tone']["tone_categories"][0]["tones"]
	socialTones = watsonResults['document_tone']["tone_categories"][2]["tones"]
	// // StoreEmotionScores(emotionScores, socialScores, "Michael")
	// // assign variables to emotion and social tones
	emotionTones = emotionTones.map((elem) => { return parseFloat(elem["score"]).toFixed(3) })
	socialTones = socialTones.map((elem) => { return parseFloat(elem["score"]).toFixed(3) })
	let [anger, disgust, fear, joy, sadness] = emotionTones;
	let [openness, conscientiousness, extraversion, agreeableness, emotionalRange] = socialTones;
	// threshold to handle emotion
	console.log(emotionTones)
	console.log(socialTones)
	speech.SetOnResult( speech_OnResultEmotion );
	let threshold = .5
	if(fear > threshold){
		let hr = 200;
		callComm = "You sound afraid. I will call the ambulance."
		if(hr > 150){ callComm = "I noticed your heart rate is considerably high and" + callComm}
		app.TextToSpeech(callComm,1,1, callEmergency)
		emoResponse = 'fear'
	}
	else if(anger > threshold){
		emoResponse = ' less angry';
		app.TextToSpeech("Sounds like something pissed you off, Mike. Maybe, I can cool you down with some soothing music, orgasmic food, or soothing nature noises?",1,1,Listen)
	}
	else if(sadness > threshold){
		emoResponse = 'sadness'
		app.TextToSpeech("Mike, you sound upset. May I soothe your soul with some music, food, motivational quotes, or get you outside?",1,1,Listen)
	}
	else if(disgust > threshold){
		app.TextToSpeech("Seems like something grossed you out. Let it go!")
		emoRresponse = 'disgust'
	}
	else if(joy > threshold){
	    emoResponse = 'joy'
		app.TextToSpeech("Mike, you sound so happy right now. Let's make the most of this mood with some music?",1 ,1 ,Listen)
	}
// 	speech.SetOnResult( speech_OnResultEmotion );
// 	Listen();
	

};

function speech_OnResultEmotion(results, partial){
	
	if( !partial ){
		speech.SetOnResult( speech_OnResult )
		let cmd = results[0].toLowerCase();
		console.log( cmd );
		if(cmd.includes("angr")){ retrieveSong("angrier")}
		else if(cmd.includes("music")){ retrieveSong(emoResponse)}
		else if(cmd.includes("cops") || cmd.includes("ambulance") || cmd.includes("doctor")) { makeCall('911') }
		else if(cmd.includes("food")){ orderFood(cmd) }
		else if(cmd.includes("motivation")){ retrieveQuote('inspire me') };
	} 
}

function speech_OnResultExpress(results, partial){
	
	if( !partial ){
		let expression = results[0].toLowerCase();
		console.log( expression );
		SendRequestEmotions( expression );
	} 
}

function callEmergency(){
	app.Call( '6463877467' )
}


