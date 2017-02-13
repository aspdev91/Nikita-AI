function FaceEmotionRecog()
{
    cam.TakePicture('/storage/emulated/0/emotion_pic.jpg'); 
    setTimeout(ProcessImage,2000);
}

function ProcessImage(){
    // app.CreateCameraView( 0.6, 0.8, ` ); 
    // app.SetImage( '/storage/external_SD/NikitaPic.jpg' )
    // app.Rotate( 180 )
    img = app.ReadFile('/storage/emulated/0/emotion_pic.jpg','base64')
    img = 'data:image/jpeg;base64,' + img
    parsedImg = makeblob(img)
    SendRequest( parsedImg )   
}

function SendRequest( pic ) 
{ 
    var httpRequest = new XMLHttpRequest(); 
    let url = 'https://api.projectoxford.ai/emotion/v1.0/recognize'
    httpRequest.onreadystatechange = function() { HandleReply(httpRequest); };  
    httpRequest.open("POST", url, true); 
    httpRequest.setRequestHeader("Ocp-Apim-Subscription-Key",
    "1bb28835371840a49874eda59e46b018"); 
    httpRequest.setRequestHeader("Content-Type",
    "application/octet-stream"); 
    httpRequest.send(pic); 
    
    app.ShowProgress( "Loading..." ); 
} 

function HandleReply( httpRequest ) 
{ 
    if( httpRequest.readyState==4 ) 
    { 
        //If we got a valid response. 
        if( httpRequest.status==200 ) 
        { 
            console.log( "Response: " + httpRequest.status + httpRequest.responseText); 
            FaceEmotionEngine(JSON.parse(httpRequest.responseText))
        } 
        //An error occurred 
        else 
           console.log( "Error: " + httpRequest.status + httpRequest.responseText); 
    } 
  app.HideProgress(); 
} 

function FaceEmotionEngine(result){
    console.log('result',result)
    emotionScores = result[0]["scores"]
    let {anger, contempt, disgust, fear, happiness, neutral, sadness, surprise} = emotionScores;

    speech.SetOnResult( speech_OnResultEmotion );
    let threshold = .4
    if(fear > threshold){
        let hr = 200;
        callComm = "You look afraid. Should I call the police?."
        if(hr > 150){ callComm = "I noticed your heart rate is considerably high and" + callComm}
        app.TextToSpeech(callComm,1,1, callEmergency)
        emoResponse = 'fear'
    }
    else if(anger > threshold || contempt > threshold){
        emoResponse = ' less angry';
        app.TextToSpeech("Looks like something pissed you off, Mike. Maybe, I can cool you down with some soothing music or meditation?",1,1,Listen)
    }
    else if(sadness > threshold){
        emoResponse = 'sadness'
        app.TextToSpeech("Mike, you look upset. May I soothe your soul with some music, food, motivational quotes, or get you outside?",1,1,Listen)
    }
    else if(neutral > threshold){
        emoResponse = 'sadness'
        app.TextToSpeech("Mike, you look so neutral. May I soothe your soul with some music, food, motivational quotes, or get you outside?",1,1,Listen) 
    }
    else if(disgust > threshold){
        app.TextToSpeech("Seems like something grossed you out. Let it go!")
        emoRresponse = 'disgust'
    }
    else if(happiness > threshold){
        emoResponse = 'joy'
        app.TextToSpeech("Mike, you look so happy right now. Let's make the most of this mood with some music?",1 ,1 ,Listen)
    }   
}


function speech_OnResultEmotion(results, partial){
	
	if( !partial ){
		speech.SetOnResult( speech_OnResult )
		let cmd = results[0].toLowerCase();
		console.log( cmd );
		if(cmd.includes("angr")){ retrieveSong("angrier")}
		else if(cmd.includes("music")){ 
			retrieveSong(emoResponse); 
		}
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


var makeblob = function (dataURL) {
            var BASE64_MARKER = ';base64,';
            if (dataURL.indexOf(BASE64_MARKER) == -1) {
                var parts = dataURL.split(',');
                var contentType = parts[0].split(':')[1];
                var raw = decodeURIComponent(parts[1]);
                return new Blob([raw], { type: contentType });
            }
            var parts = dataURL.split(BASE64_MARKER);
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;

            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], { type: contentType });
        }
